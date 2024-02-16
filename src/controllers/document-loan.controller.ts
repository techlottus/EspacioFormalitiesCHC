import {intercept, service} from '@loopback/core';
import {
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  DOCUMENT_LOAN,
  DOCUMENT_LOAN_V1_ROUTE,
  postDocumentLoanOk,
} from '../constants';
import {FileSizeValidationInterceptor} from '../interceptors';
import {DocumentLoanRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  invalidToken,
  notFoundError,
  postDocumentLoanOpenAPI,
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


export class DocumentLoanController {
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
  @intercept(FileSizeValidationInterceptor.BINDING_KEY)
  @post(DOCUMENT_LOAN_V1_ROUTE)
  @response(201, postDocumentLoanOpenAPI)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityChA)
  @response(503, unavailableService)
  async postDocumentLoan(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentLoanRB),
        },
      },
    })
    requestBody: DocumentLoanRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION AND FETCH STUDENT DATA
    const studentData = await this.authorizationService.checkAuthorization(
      DOCUMENT_LOAN_V1_ROUTE,
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
      DOCUMENT_LOAN,
    );

    // CONSUME SF SERVICIOS ESCOLARES TO REQUEST 'Prestamo de documentos'
    // const ticketNumber = await this.proceduresService.requestProcedure(
    //   studentData.school,
    //   'Prestamo de documentos',
    //   sfRequestBody,
    // );

    // CONSUME 'PAYMENTS' SERVICE TO RETRIEVE TRANSACTION NUMBER
    // const transactionNumber =
    //   await this.transactionNumberService.getTransactionNumber(
    //     authHeader,
    //     ticketNumber,
    //     DOCUMENT_LOAN,
    //     studentData,
    //   );

    // SEND OK RESPONSE
    const data = {
      ticketNumber: '12345678',
      transactionNumber: '1234566',
    };
    return successfulChcObject(data, 201, postDocumentLoanOk);
  }
}
