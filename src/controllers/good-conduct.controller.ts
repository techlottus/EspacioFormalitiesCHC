import {service} from '@loopback/core';
import {
  get, getModelSchemaRef, param, post, requestBody, response
} from '@loopback/rest';
import {
  GOOD_CONDUCT, GOOD_CONDUCT_ROUTE, ULA, getGoodConductOk, postGoodConductOk
} from '../constants';
import {CommonsRB, SSCHCResponse} from '../models';
import {
  commonPostSwagger,
  expiredToken,
  getGoodConductSwagger,
  invalidToken,
  unavailableService
} from '../openAPI';
import {
  AuthorizationService,
  CommonPropertiesService,
  RequestProcedureService,
  TransactionNumberService
} from '../services';
import {successfulChcObject} from '../utils';


export class GoodConductController {
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

  @get(GOOD_CONDUCT_ROUTE)
  @response(200, getGoodConductSwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async goodConductData(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    await this.authorizationService.checkAuthorization(
      GOOD_CONDUCT_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );
    const delivery = await this.commonPropertiesService.fetchDeliveryArray(ULA);
    return successfulChcObject({delivery}, 200, getGoodConductOk);
  }

  @post(GOOD_CONDUCT_ROUTE)
  @response(200, commonPostSwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async requestGoodConduct(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CommonsRB),
        },
      },
    })
    goodConductRB: CommonsRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      GOOD_CONDUCT_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET "SERVICIO" FIELDS
    const serviceObject =
      this.commonPropertiesService.setCommonPropertiesUteg(
        studentData,
        goodConductRB,
        GOOD_CONDUCT
      );

    // SET SF REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      serviceObject,
      goodConductRB.files,
      studentData,
      GOOD_CONDUCT,
    );

    // CONSUME PROCEDURES SERVICE TO REQUEST 'Constancia de Estudio'
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Constancia de Estudio',
      sfRequestBody,
    );

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
    return successfulChcObject(data, 201, postGoodConductOk);
  }
}
