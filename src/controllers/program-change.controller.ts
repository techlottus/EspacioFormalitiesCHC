import {service} from '@loopback/core';
import {
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {
  PROGRAM_CHANGE,
  PROGRAM_CHANGE_ROUTE,
  postProgramChangeStatusOk
} from '../constants';
import {CommonsRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  invalidToken,
  notFoundError,
  postProgramChangeOpenAPI,
  unavailableService,
  unprocessableEntityChA
} from '../openAPI';
import {
  AuthorizationService,
  RequestProcedureService,
  TransactionNumberService
} from '../services';
import {successfulChcObject} from '../utils';
import {ProgramChangeService} from '../services/program-change.service';

export class ProgramChangeController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(ProgramChangeService)
    protected programChangeService: ProgramChangeService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) { }

  @post(PROGRAM_CHANGE_ROUTE)
  @response(201, postProgramChangeOpenAPI)
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
          schema: getModelSchemaRef(CommonsRB),
        },
      },
    })
    requestBody: CommonsRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {

    // GRANT AUTHORIZATION AND FETCH STUDENT DATA
    const studentData = await this.authorizationService.checkAuthorization(
      PROGRAM_CHANGE_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    const serviceFields =
      await this.programChangeService.setProgramChanceServiceProperties(
        studentData,
        requestBody,
      );

    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      serviceFields,
      requestBody.files,
      studentData,
      PROGRAM_CHANGE,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'cambio de programa'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Cambio de programa',
      sfRequestBody,
    );

    // CONSUME 'PAYMENTS' SERVICE TO RETRIEVE TRANSACTION NUMBER
    const detailId =
      await this.transactionNumberService.fetchDetailCodeProgramChange(
        studentData.school,
        studentData.campusId,
        studentData.modality
      );
    const transactionNumber =
      await this.transactionNumberService.getTransactionNumberWithDetailCode(
        authHeader,
        ticketNumber,
        detailId
      );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
      transactionNumber,
    };
    return successfulChcObject(data, 201, postProgramChangeStatusOk);
  }
}
