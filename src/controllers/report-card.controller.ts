import {service} from '@loopback/core';
import {
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  REPORT_CARD_V1_ROUTE,
  postReportCardStatus,
} from '../constants';
import {ReportCardData} from '../interfaces';
import {ReportCardRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  invalidToken,
  notFoundError,
  postReportCard,
  unavailableService,
  unprocessableEntityAdditionalProps,
} from '../openAPI';
import {
  AuthorizationService,
  ReportCardService,
} from '../services';
import {successfulChcObject} from '../utils';

export class ReportCardController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(ReportCardService)
    protected reportCardService: ReportCardService,
  ) { }

  @post(REPORT_CARD_V1_ROUTE)
  @response(200, postReportCard)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityAdditionalProps)
  @response(503, unavailableService)
  async postReportCard(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ReportCardRB),
        },
      },
    })
    requestBody: ReportCardRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {

    // GRANT AUTHORIZATION
    await this.authorizationService.checkAuthorization(
      REPORT_CARD_V1_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // FETCH DATA
    const reportCardArrayDataFromPermissionsService =
      await this.reportCardService.fetchReportCardDataFromPermissionsService(
        authHeader,
        requestBody
      );

    // STRUCTURE DATA
    const creditsData = this.reportCardService.setCreditsData(
      reportCardArrayDataFromPermissionsService[0]
    );
    const subjectsArray = this.reportCardService.setSubjectsArray(
      reportCardArrayDataFromPermissionsService
    );
    const partialAverageArray = this.reportCardService.setPartialAverages(
      reportCardArrayDataFromPermissionsService[0]
    )

    // SEND RESPONSE
    const reportCardData: ReportCardData = {
      card: creditsData,
      subjects: subjectsArray,
      partialAverages: partialAverageArray
    }
    return successfulChcObject(reportCardData, 200, postReportCardStatus);
  }
}
