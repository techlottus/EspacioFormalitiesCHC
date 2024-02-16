import {service} from '@loopback/core';
import {
  get, getModelSchemaRef, param, post, requestBody, response
} from '@loopback/rest';
import {
  PROOF_OF_STUDY,
  PROOF_OF_STUDY_UTEG_ROUTE,
  getPosUtegOk,
  postProofOfStudyStatusOk,
} from '../constants';
import {ProofOfStudyRB, SSCHCResponse} from '../models';
import {
  AuthorizationService,
  ProofOfStudyService,
  RequestProcedureService,
  TransactionNumberService,
  UpdateCollectionsService
} from '../services';
import {successfulChcObject} from '../utils';
import {
  expiredToken,
  getPoSUtegSwagger,
  invalidToken,
  postProofOfStudySwagger,
  unavailableService
} from '../openAPI';

const route = PROOF_OF_STUDY_UTEG_ROUTE;

export class ProofOfStudyUtegController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(ProofOfStudyService)
    protected proofOfStudyService: ProofOfStudyService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
    @service(UpdateCollectionsService)
    protected updateCollectionsService: UpdateCollectionsService,
  ) { }

  @get(route)
  @response(200, getPoSUtegSwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async goodConductData(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const {levelCode, school, modality} =
      await this.authorizationService.checkAuthorization(
        route,
        serviceId,
        serviceName,
        authHeader,
      );

    // UPDATE COLLECTIONS IF NEEDED
    await this.updateCollectionsService.checkUpdateProofOfStudy(
      school,
      modality,
      authHeader,
    );
    // FETCH DATA
    const proofOfStudyArray =
      await this.proofOfStudyService.getProofOfStudyWithCostsArray(
        school,
        levelCode,
        modality,
        authHeader,
      );
    const deliveryArray =
      await this.proofOfStudyService.commonPropertiesService.
        fetchDeliveryArray(
          school,
        );
    const data = {
      proofOfStudy: proofOfStudyArray,
      delivery: deliveryArray
    }
    return successfulChcObject(data, 200, getPosUtegOk);
  }

  @post(route)
  @response(200, postProofOfStudySwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async requestGoodConduct(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProofOfStudyRB),
        },
      },
    })
    proofOfStudyRB: ProofOfStudyRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      route,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET "SERVICIO" FIELDS
    const serviceObject =
      await this.proofOfStudyService.setProofOfStudyServicePropertiesUteg(
        studentData,
        proofOfStudyRB,
      );

    // SET SF REQUEST BODY
    // const sfRequestBody = await this.proceduresService.setSfRequestBody(
    //   serviceObject,
    //   proofOfStudyRB.files,
    //   studentData,
    //   PROOF_OF_STUDY,
    // );

    // // CONSUME PROCEDURES SERVICE TO REQUEST 'Constancia de Estudio'
    // const ticketNumber = await this.proceduresService.requestProcedure(
    //   studentData.school,
    //   'Constancia de Estudio',
    //   sfRequestBody,
    // );

    // // CONSUME PAYMENTS SERVICE TO RETRIEVE TRANSACTION NUMBER
    // const transactionNumber =
    //   await this.transactionNumberService.getTransactionNumber(
    //     authHeader,
    //     ticketNumber,
    //     GOOD_CONDUCT,
    //     studentData
    //   );

    // SEND RESPONSE
    const data = {
      ticketNumber: "12345",
      transactionNumber: "6789",
    };
    return successfulChcObject(data, 201, postProofOfStudyStatusOk);
  }
}
