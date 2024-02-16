import {intercept, service} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  PROOF_OF_STUDY,
  PROOF_OF_STUDY_ROUTE,
  getProofOfStudyStatusOk,
  postProofOfStudyStatusOk,
} from '../constants';
import {FileSizeValidationInterceptor} from '../interceptors';
import {ProofOfStudyRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  getProofOfStudySwagger,
  invalidToken,
  notFoundError,
  postProofOfStudySwagger,
  unavailableService,
  unprocessableEntitySedena,
} from '../openAPI';
import {
  AuthorizationService,
  ProofOfStudyService,
  RequestProcedureService,
  TransactionNumberService,
  UpdateCollectionsService,
} from '../services';
import {successfulChcObject} from '../utils';

export class ProofOfStudyController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(UpdateCollectionsService)
    protected updateCollectionsService: UpdateCollectionsService,
    @service(ProofOfStudyService)
    protected proofOfStudyService: ProofOfStudyService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) { }

  @get(PROOF_OF_STUDY_ROUTE)
  @response(200, getProofOfStudySwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async find(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const {levelCode, school, modality} =
      await this.authorizationService.checkAuthorization(
        PROOF_OF_STUDY_ROUTE,
        serviceId,
        serviceName,
        authHeader,
      );

    // UPDATE COLLECTIONS IF NEEDED
    await this.updateCollectionsService.checkUpdateProofOfStudy(
      authHeader,
      modality,
      school,
    );
    // FETCH DATA
    const modal = await this.proofOfStudyService.fetchModalData(
      school,
      modality
    );
    const proofOfStudies =
      await this.proofOfStudyService.getProofOfStudyWithCostsArray(
        school,
        levelCode,
        modality,
        authHeader,
      );
    const {delivery, campus} =
      await this.proofOfStudyService.commonPropertiesService.
        fetchDeliveryAndCampusArrays(
          school,
        );
    // SEND RESPONSE
    const data = {
      modal,
      proofOfStudies,
      delivery,
      campus
    };
    return successfulChcObject(data, 200, getProofOfStudyStatusOk);
  }

  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(PROOF_OF_STUDY_ROUTE)
  @response(201, postProofOfStudySwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntitySedena)
  @response(503, unavailableService)
  async requestProofOfStudy(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProofOfStudyRB),
        },
      },
    })
    requestBodyPoS: ProofOfStudyRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      PROOF_OF_STUDY_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET "SERVICIO" FIELDS
    const servicioObject =
      await this.proofOfStudyService.setProofOfStudyServiceProperties(
        studentData,
        requestBodyPoS,
      );

    // SET SF REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      servicioObject,
      requestBodyPoS.files,
      studentData,
      PROOF_OF_STUDY,
    );

    // CONSUME PROCEDURES SERVICE TO REQUEST 'Constancia de Estudio'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Constancia de Estudio',
      sfRequestBody,
    );

    // CONSUME PAYMENTS SERVICE TO RETRIEVE TRANSACTION NUMBER
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumberWithDetailCode(
        authHeader,
        ticketNumber,
        requestBodyPoS.detailId,
      );

    // SEND RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postProofOfStudyStatusOk);
  }
}
