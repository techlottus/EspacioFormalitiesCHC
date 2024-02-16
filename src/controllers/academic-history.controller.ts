import {service} from '@loopback/core';
import {
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  ACADEMIC_HISTORY_V1_ROUTE,
  postAcademicHistoryStatus,
} from '../constants';
import {AcademicHistoryData} from '../interfaces';
import {AcademicHistoryRB, SSCHCResponse} from '../models';
import {
  academicHistoryPostSwagger,
  badRequest,
  expiredToken,
  invalidToken,
  notFoundError,
  unavailableService,
  unprocessableEntityAdditionalProps,
} from '../openAPI';
import {
  AcademicHistoryService,
  AuthorizationService,
} from '../services';
import {successfulChcObject} from '../utils';

export class AcademicHistoryController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(AcademicHistoryService)
    protected academicHistoryService: AcademicHistoryService,
  ) { }

  @post(ACADEMIC_HISTORY_V1_ROUTE)
  @response(200, academicHistoryPostSwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityAdditionalProps)
  @response(503, unavailableService)
  async setAcademicHistoryData(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AcademicHistoryRB),
        },
      },
    })
    requestBody: AcademicHistoryRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    await this.authorizationService.checkAuthorization(
      ACADEMIC_HISTORY_V1_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // FETCH DATA
    const historyDataArrayFromPermissionsService =
      await this.academicHistoryService.
        fetchAcademicHistoryDataFromPermissionsService(
          authHeader,
          requestBody
        );

    // STRUCTURE DATA
    const cardData = this.academicHistoryService.setCardData(
      historyDataArrayFromPermissionsService[0]
    );
    const areasData = this.academicHistoryService.setAreasData(
      historyDataArrayFromPermissionsService
    );

    // SEND RESPONSE
    const academicHistoryData: AcademicHistoryData = {
      card: cardData,
      areasData
    }
    return successfulChcObject(academicHistoryData, 200, postAcademicHistoryStatus);
  }
}
