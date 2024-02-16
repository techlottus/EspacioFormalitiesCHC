import {service} from '@loopback/core';
import {
  get, getModelSchemaRef, param, post, requestBody, response
} from '@loopback/rest';
import {
  STUDY_CERTIFICATE,
  STUDY_CERT_UTEG_ROUTE,
  UTEG_ID,
  getStudyCertUtegStatusOK,
  postStudyCertificateStatusOk
} from '../constants';
import {SSCHCResponse, StudyCertificateRB} from '../models';
import {
  expiredToken,
  getStudyCertUtegSwagger,
  invalidToken,
  postStudyCertificateSwagger,
  unavailableService
} from '../openAPI';
import {
  AuthorizationService,
  RequestProcedureService,
  StudyCertificateGetService,
  StudyCertificatePostService,
  TransactionNumberService,
} from '../services';
import {successfulChcObject} from '../utils';

const route = STUDY_CERT_UTEG_ROUTE;

export class StudyCertUtegController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(StudyCertificateGetService)
    protected certificateGetService: StudyCertificateGetService,
    @service(StudyCertificatePostService)
    protected certificatePostService: StudyCertificatePostService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) { }

  @get(route)
  @response(200, getStudyCertUtegSwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async goodConductData(
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
    // FETCH DATA
    const utegRequirementsDoc =
      await this.certificateGetService.fetchRequirementById(UTEG_ID);
    const studyCertificateArray =
      await this.certificateGetService.setCertificateWithCostArray(
        studentData,
        authHeader
      );
    // SEND RESPONSE
    const data = {
      requirements: [utegRequirementsDoc],
      studyCertificateType: studyCertificateArray,
    }
    return successfulChcObject(data, 200, getStudyCertUtegStatusOK);
  }

  @post(route)
  @response(200, postStudyCertificateSwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async requestGoodConduct(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudyCertificateRB),
        },
      },
    })
    studyCertificateRB: StudyCertificateRB,
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
      await this.certificatePostService.setStudyCertificateServiceProperties_UTEG(
        studentData,
        studyCertificateRB,
      );

    // SET SF REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      serviceObject,
      studyCertificateRB.files,
      studentData,
      STUDY_CERTIFICATE,
    );

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
    return successfulChcObject(data, 201, postStudyCertificateStatusOk);
  }
}
