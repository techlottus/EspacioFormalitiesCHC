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
  ACADEMIC_RECORD,
  ACADEMIC_RECORD_ROUTE,
  getAcademicRecordStatusOk,
  postAcademicRecordStatusOk,
} from '../constants';
import {FileSizeValidationInterceptor} from '../interceptors';
import {CommonsRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  getAcademicRecordSwagger,
  invalidToken,
  notFoundError,
  postAcademicRecordSwagger,
  unavailableService,
  unprocessableEntityChA,
} from '../openAPI';
import {
  AcademicRecordService,
  AuthorizationService,
  RequestProcedureService,
  TransactionNumberService,
  UpdateCollectionsService,
} from '../services';
import {successfulChcObject} from '../utils';
import {repository} from '@loopback/repository';
import {QrValidationRepository} from '../repositories';

export class AcademicRecordController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(UpdateCollectionsService)
    protected updateCollectionsService: UpdateCollectionsService,
    @service(AcademicRecordService)
    protected academicRecordService: AcademicRecordService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
    @repository(QrValidationRepository)
    protected qrValidationRepository: QrValidationRepository
  ) { }

  @get(ACADEMIC_RECORD_ROUTE)
  @response(200, getAcademicRecordSwagger)
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
      ACADEMIC_RECORD_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );
    // UPDATE COLLECTIONS IF NEEDED
    await this.updateCollectionsService.checkUpdateCampus(
      studentData.school,
      authHeader,
    );
    // FETCH DATA
    const {delivery, campus} =
      await this.academicRecordService.commonPropertiesService.
        fetchDeliveryWithQrAndCampusArrays(
          studentData.school,
        );
    // SEND RESPONSE
    const data = {delivery, campus};
    return successfulChcObject(data, 200, getAcademicRecordStatusOk);
  }

  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(ACADEMIC_RECORD_ROUTE)
  @response(201, postAcademicRecordSwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityChA)
  @response(503, unavailableService)
  async requestAcademicRecord(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CommonsRB),
        },
      },
    })
    academicRecordRB: CommonsRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      ACADEMIC_RECORD_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET "SERVICIO" FIELDS
    const serviceObject =
      await this.academicRecordService.setAcademicRecordServiceProperties(
        studentData,
        academicRecordRB,
      );

    // SET SALES FORCE REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      serviceObject,
      academicRecordRB.files,
      studentData,
      ACADEMIC_RECORD,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Historial Académico'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Historial Académico',
      sfRequestBody,
    );

    // CONSUME 'PAYMENTS' SERVICE TO RETRIEVE TRANSACTION NUMBER
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumber(
        authHeader,
        ticketNumber,
        ACADEMIC_RECORD,
        studentData,
      );

    // SAVE PROCEDURE DATA FOR FUTURE VALIDATION
    await this.qrValidationRepository.saveProcedureData(
      studentData,
      'Historial Academico',
      ticketNumber,
      academicRecordRB.delivery ?? 'fisica'
    );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postAcademicRecordStatusOk);
  }
}
