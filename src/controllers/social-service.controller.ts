import {service} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  SOCIAL_SERVICE,
  SOCIAL_SERVICE_ROUTE,
  getSocialServiceStatusOk,
  postSocialServiceStatusOk,
} from '../constants';
import {SSCHCResponse, SocialServiceRB} from '../models';
import {
  badRequest,
  expiredToken,
  getSocialServiceSuccessfulSwagger,
  invalidToken,
  notFoundError,
  postSocialServiceSuccessfulSwagger,
  unavailableService,
} from '../openAPI';
import {
  AuthorizationService,
  RequestProcedureService,
  SocialServicesService,
  TransactionNumberService,
} from '../services';
import {successfulChcObject} from '../utils';
import {intercept} from '@loopback/core';
import {FileSizeValidationInterceptor} from '../interceptors';

export class SocialServiceController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(SocialServicesService)
    protected socialServicesService: SocialServicesService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) {}

  @get(SOCIAL_SERVICE_ROUTE)
  @response(200, getSocialServiceSuccessfulSwagger)
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
    const studentData = await this.authorizationService.checkAuthorization(
      SOCIAL_SERVICE_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET RESPONSE
    const data = await this.socialServicesService.setSocialServiceGetResponse(
      studentData.school,
    );
    return successfulChcObject(data, 200, getSocialServiceStatusOk);
  }
  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(SOCIAL_SERVICE_ROUTE)
  @response(201, postSocialServiceSuccessfulSwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(503, unavailableService)
  async requestSocialService(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(SocialServiceRB),
        },
      },
    })
    socialServiceReqBody: SocialServiceRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      SOCIAL_SERVICE_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // validate social service type
    await this.socialServicesService.validateSocialServiceTypeId(
      studentData.school,
      socialServiceReqBody.socialServiceTypeId,
    );

    // set Servicio properties
    const servicioObject =
      this.socialServicesService.setSocialServiceServicioProperties(
        studentData,
        socialServiceReqBody,
      );

    // Set requestbody of the request to Salesforce
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      servicioObject,
      socialServiceReqBody.files,
      studentData,
      SOCIAL_SERVICE,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Servicio Social'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Servicio Social',
      sfRequestBody,
    );

    // CONSUME PAYMENTS SERVICE TO RETRIEVE TRANSACTION NUMBER
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumber(
        authHeader,
        ticketNumber,
        SOCIAL_SERVICE,
        studentData,
      );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postSocialServiceStatusOk);
  }
}
