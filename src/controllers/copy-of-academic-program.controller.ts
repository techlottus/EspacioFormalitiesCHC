import {service} from '@loopback/core';
import {
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  COPY_OF_ACADEMIC_PROGRAM,
  COPY_OF_ACADEMIC_PROGRAM_V1_ROUTE,
  postCopyOfAcademicProgramOk,
} from '../constants';
import {CommonsRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  invalidToken,
  notFoundError,
  postCopyOfAcademicProgramOpenAPI,
  unavailableService,
  unprocessableEntityChA,
} from '../openAPI';
import {
  AuthorizationService,
  CommonPropertiesService,
  RequestProcedureService,
  TransactionNumberService,
} from '../services';
import {successfulChcObject} from '../utils';

export class CopyOfAcademicProgramController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(CommonPropertiesService)
    protected commonPropertiesService: CommonPropertiesService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(TransactionNumberService)
    protected transactionNumberService: TransactionNumberService,
  ) { }

  @post(COPY_OF_ACADEMIC_PROGRAM_V1_ROUTE)
  @response(201, postCopyOfAcademicProgramOpenAPI)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityChA)
  @response(503, unavailableService)
  async getCopyOfAcademicProgram(
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
      COPY_OF_ACADEMIC_PROGRAM_V1_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    const serviceFields =
      this.commonPropertiesService.setCommonPropertiesUteg(
        studentData,
        requestBody,
      );

    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      serviceFields,
      requestBody.files,
      studentData,
      COPY_OF_ACADEMIC_PROGRAM,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Copia de programa académico'
    // const ticketNumber = await this.proceduresService.requestProcedure(
    //   studentData.school,
    //   'Copia de programa academico',
    //   sfRequestBody,
    // );

    // CONSUME 'PAYMENTS' SERVICE TO RETRIEVE TRANSACTION NUMBER
    // const transactionNumber =
    //   await this.transactionNumberService.getTransactionNumber(
    //     authHeader,
    //     ticketNumber,
    //     COPY_OF_ACADEMIC_PROGRAM,
    //     studentData,
    //   );

    // SEND OK RESPONSE
    const data = {
      ticketNumber: '12345679',
      transactionNumber: '1234565',
    };
    return successfulChcObject(data, 201, postCopyOfAcademicProgramOk);
  }
}
