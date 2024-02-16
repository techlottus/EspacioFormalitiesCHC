import {intercept, service} from '@loopback/core';
import {
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  ADMISSION_CERTIFICATE,
  ADMISSION_CERTIFICATE_ROUTE,
  postAdmissionCertStatusOk,
} from '../constants';
import {FileSizeValidationInterceptor} from '../interceptors';
import {AdmissionCertRequestBody, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  invalidToken,
  notFoundError,
  postAdmissionCertOpenAPI,
  unavailableService,
  unprocessableEntityChA,
} from '../openAPI';
import {
  AdmissionCertificateService,
  AuthorizationService,
  RequestProcedureService,
  TransactionNumberService,
} from '../services';
import {successfulChcObject} from '../utils';

export class AdmissionCertificateController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(AdmissionCertificateService)
    protected admissionCertificateService: AdmissionCertificateService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) { }
  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(ADMISSION_CERTIFICATE_ROUTE)
  @response(201, postAdmissionCertOpenAPI)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityChA)
  @response(503, unavailableService)
  async requestAdmissionCertificate(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdmissionCertRequestBody),
        },
      },
    })
    requestBody: AdmissionCertRequestBody,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION AND FETCH STUDENT DATA
    const studentData = await this.authorizationService.checkAuthorization(
      ADMISSION_CERTIFICATE_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    const servicioObject =
      this.admissionCertificateService.setAdmissionCertificateServiceProperties(
        studentData,
        requestBody,
      );

    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      servicioObject,
      requestBody.files,
      studentData,
      ADMISSION_CERTIFICATE,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Acta de Admisión'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Acta de Admisión',
      sfRequestBody,
    );

    // FETCH 'TRANSACTION NUMBER' FROM 'PAYMENTS' SERVICE
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumber(
        authHeader,
        ticketNumber,
        ADMISSION_CERTIFICATE,
        studentData,
      );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postAdmissionCertStatusOk);
  }
}
