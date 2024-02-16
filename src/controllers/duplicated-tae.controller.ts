import {service} from '@loopback/core';
import {
  getModelSchemaRef, param, post, requestBody, response
} from '@loopback/rest';
import {
  DUPLICATED_TAE, DUPLICATED_TAE_ROUTE, postDuplicatedTaeOk
} from '../constants';
import {CommonsRB, SSCHCResponse} from '../models';
import {
  commonPostSwagger, expiredToken, invalidToken, unavailableService
} from '../openAPI';
import {
  AuthorizationService, CommonPropertiesService, RequestProcedureService
} from '../services';
import {successfulChcObject} from '../utils';

const route = DUPLICATED_TAE_ROUTE;

export class DuplicatedTaeController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(CommonPropertiesService)
    protected commonPropertiesService: CommonPropertiesService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
  ) { }

  @post(route)
  @response(200, commonPostSwagger)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async requestDuplicatedTae(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CommonsRB),
        },
      },
    })
    duplicatedTaeRB: CommonsRB,
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
      this.commonPropertiesService.setCommonPropertiesUteg(
        studentData,
        duplicatedTaeRB,
      );

    // SET SF REQUEST BODY
    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      serviceObject,
      duplicatedTaeRB.files,
      studentData,
      DUPLICATED_TAE,
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
    return successfulChcObject(data, 201, postDuplicatedTaeOk);
  }
}
