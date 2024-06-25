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
  STUDY_CERTIFICATE,
  STUDY_CERTIFICATE_ROUTE,
  STUDY_CERTIFICATE_V2_ROUTE,
  getStudyCertificateStatusOk,
  getStudyCertificateStatusOkV2,
  postStudyCertificateStatusOk,
} from '../constants';
import {FileSizeValidationInterceptor} from '../interceptors';
import {SSCHCResponse, StudyCertificateRB} from '../models';
import {
  badRequest,
  expiredToken,
  getStudyCertificateSwagger,
  invalidToken,
  notFoundError,
  postProofOfStudySwagger,
  unavailableService,
  unprocessableEntitySC,
} from '../openAPI';
import {
  AuthorizationService,
  RequestProcedureService,
  StudyCertificateGetService,
  StudyCertificatePostService,
  TransactionNumberService,
  UpdateCollectionsService,
} from '../services';
import {successfulChcObject} from '../utils';

export class StudyCertificateController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(UpdateCollectionsService)
    protected updateCollectionsService: UpdateCollectionsService,
    @service(StudyCertificateGetService)
    protected studyCertificateGetService: StudyCertificateGetService,
    @service(StudyCertificatePostService)
    protected studyCertificatePostService: StudyCertificatePostService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) { }

  @get(STUDY_CERTIFICATE_ROUTE)
  @response(200, getStudyCertificateSwagger)
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
      STUDY_CERTIFICATE_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // UPDATE COLLECTIONS
    const {school, modality} = studentData;
    await this.updateCollectionsService.checkUpdateStudyCertificate(
      authHeader,
      modality,
      school,
    );

    // SET RESPONSE
    const {delivery, campus} =
      await this.studyCertificatePostService.commonPropertiesService.
        fetchDeliveryAndCampusArrays(
          school,
        );
    const data = {
      studyCertificateType:
        await this.studyCertificateGetService.setCertificateWithCostArray(
          studentData,
          authHeader,
        ),
      studyCertificateTotalType:
        await this.studyCertificateGetService.fetchTotalStudyCertificateArray(
          school,
        ),
      delivery,
      campus
    };
    return successfulChcObject(data, 200, getStudyCertificateStatusOk);
  }

  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(STUDY_CERTIFICATE_ROUTE)
  @response(201, postProofOfStudySwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntitySC)
  @response(503, unavailableService)
  async requestStudyCertificate(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudyCertificateRB),
        },
      },
    })
    requestBodyStudyCert: StudyCertificateRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      STUDY_CERTIFICATE_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET "SERVICIO" FIELDS
    const servicioObject =
      await this.studyCertificatePostService.setStudyCertificateServiceProperties(
        studentData,
        requestBodyStudyCert,
      );

    // SET SF REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      servicioObject,
      requestBodyStudyCert.files,
      studentData,
      STUDY_CERTIFICATE,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Constancia de Estudio'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Certificado de Estudio',
      sfRequestBody,
    );

    // CONSUME PAYMENTS SERVICE TO RETRIEVE TRANSACTION NUMBER
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumberWithDetailCode(
        authHeader,
        ticketNumber,
        requestBodyStudyCert.detailId,
      );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postStudyCertificateStatusOk);
  }

  @get(STUDY_CERTIFICATE_V2_ROUTE)
  @response(200, getStudyCertificateSwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async studyCertificateGetData(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      STUDY_CERTIFICATE_V2_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // UPDATE COLLECTIONS
    const {levelCode, modality, school} = studentData;
    await this.updateCollectionsService.checkUpdateStudyCertificate(
      authHeader,
      modality,
      school,
    );

    // FETCH DATA
    const requirements =
      await this.studyCertificateGetService.setRequirementsArray(levelCode);
    const flags =
      await this.studyCertificateGetService.setStudyCertFlags(studentData);
    const studyCertificateType =
      await this.studyCertificateGetService.setCertificateWithCostArray(
        studentData,
        authHeader,
      );
    const studyCertificateTotalType =
      await this.studyCertificateGetService.fetchTotalStudyCertificateArray(
        school
      );
    const {delivery, campus} =
      await this.studyCertificatePostService.commonPropertiesService.
        fetchPhysicalDeliveryAndCampusArrays(
          school,
        );

    // SEND RESPONSE
    const data = {
      requirements,
      flags,
      studyCertificateType,
      studyCertificateTotalType,
      delivery,
      campus
    };
    return successfulChcObject(data, 200, getStudyCertificateStatusOkV2);
  }


  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(STUDY_CERTIFICATE_V2_ROUTE)
  @response(201, postProofOfStudySwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntitySC)
  @response(503, unavailableService)
  async requestStudyCertificateV2(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudyCertificateRB),
        },
      },
    })
    requestBodyStudyCert: StudyCertificateRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      STUDY_CERTIFICATE_V2_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET "SERVICIO" FIELDS
    const servicioObject =
      await this.studyCertificatePostService.setStudyCertificateServiceProperties(
        studentData,
        requestBodyStudyCert,
      );

    // SET SF REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      servicioObject,
      requestBodyStudyCert.files,
      studentData,
      STUDY_CERTIFICATE,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Constancia de Estudio'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Certificado de Estudio',
      sfRequestBody,
    );

    // CONSUME PAYMENTS SERVICE TO RETRIEVE TRANSACTION NUMBER
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumberWithDetailCode(
        authHeader,
        ticketNumber,
        requestBodyStudyCert.detailId,
      );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postStudyCertificateStatusOk);
  }
}
