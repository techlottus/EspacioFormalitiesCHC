import {service} from '@loopback/core';
import {get, param, response} from '@loopback/rest';
import {calendarsStatusOk, CALENDARS_ROUTE_V1} from '../constants';
import {SSCHCResponse} from '../models';
import {calendarsResponseSwagger} from '../openAPI';
import {AuthorizationService, CalendarsService} from '../services';
import {successfulChcObject} from '../utils';

export class CalendarsController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(CalendarsService)
    protected calendarsService: CalendarsService,
  ) { }

  @get(CALENDARS_ROUTE_V1)
  @response(200, calendarsResponseSwagger)
  async find(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      CALENDARS_ROUTE_V1,
      serviceId,
      serviceName,
      authHeader,
    );

    const {school, levelCode, periodCode} = studentData;
    const calendarsObject = await this.calendarsService.getCalendars(
      school,
      levelCode,
      periodCode,
    );

    let calendarsStatus = calendarsStatusOk;
    if (!Object.keys(calendarsObject.desk).length) {
      calendarsStatus = 'No desktop calendar found for this user';
      if (!Object.keys(calendarsObject.mobile).length) {
        calendarsStatus = 'No calendars found for this user';
      }
    } else if (!Object.keys(calendarsObject.mobile).length) {
      calendarsStatus = 'No mobile calendar found for this user';
    }

    return successfulChcObject(calendarsObject, 200, calendarsStatus);
  }
}
