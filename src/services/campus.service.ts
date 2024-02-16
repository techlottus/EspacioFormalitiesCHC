import {BindingScope, inject, injectable, service} from '@loopback/core';
import {Campus, CampusObject, ErrorsService} from '.';
import {PERMISSIONS_ID, PERMISSIONS_SERVICE_CAMPUS_URL} from '../constants';
import {logMethodAccessDebug, logger} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class CampusService {
  constructor(
    @inject('services.Campus')
    protected campusProxyService: Campus,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) { }

  async getCampus(authHeader: string): Promise<CampusObject[]> {
    logMethodAccessDebug(this.getCampus.name);
    let campusArray: CampusObject[];
    try {
      logger.info(
        `Trying to fetch campus array from 'permissions service' at ` +
        `${PERMISSIONS_SERVICE_CAMPUS_URL}`
      );
      const permissionsResponse = await this.campusProxyService.fetchCampusData(
        authHeader,
        PERMISSIONS_ID,
        PERMISSIONS_SERVICE_CAMPUS_URL!,
      );
      logger.debug(
        `permissionsResponse: ${JSON.stringify(permissionsResponse.data)}`
      );
      campusArray = permissionsResponse.data;
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        'Campus array',
        'Permissions',
      );
    }
    this.validateCampusResponse(campusArray);
    return campusArray;
  }

  private validateCampusResponse(campusArray: CampusObject[]) {
    if (!campusArray.length)
      throw this.errorsService.setErrorResponse(
        `Array couldn't be retrieved from 'permissions' service`,
        'Campus array was empty',
        500,
      );
    logger.debug(`Service answered correctly with campus array`);
  }
}
