////////////////    AuthorizationService ///////////////////
// - Logs access data at every request to the API
// - Validates service-id and service-name
// - Communicates with Oauth2.service to verify accessToken
/////////////////////////////////////////////////////////////

import {BindingScope, inject, injectable, service} from '@loopback/core';
import {HttpErrors, Request, RestBindings} from '@loopback/rest';
import {ErrorsService, Oauth2} from '.';
import {OAUTH_SERVICE_URL, SERVICE_ID, SERVICE_NAME} from '../constants';
import {
  getStudentData,
  logMethodAccessDebug,
  logMethodAccessTrace,
  logger,
  setLogsEmail,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthorizationService {
  constructor(
    @inject(RestBindings.Http.REQUEST)
    private request: Request,
    @inject('services.Oauth2')
    protected oauthService: Oauth2,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) {}

  // HEADERS VALIDATION
  async checkAuthorization(
    route: string,
    serviceId: string,
    serviceName: string,
    authHeader: string,
  ) {
    // FETCH STUDENT DATA AND SET EMAIL INTO LOGS
    const studentData = getStudentData(authHeader);
    setLogsEmail(studentData.email);
    logMethodAccessTrace(this.checkAuthorization.name);
    logger.info(`${route} endpoint accessed`);
    logger.debug('Method: ' + JSON.stringify(this.request.method));
    logger.trace('Headers: ' + JSON.stringify(this.request.headers));
    this.validateHeaders(serviceId, serviceName, authHeader);
    if (process.env.ENVIRONMENT !== 'localhost')
      await this.validateAccessToken(authHeader);
    logger.debug(`StudentData: ${JSON.stringify(studentData)}`);
    return studentData;
  }

  private validateHeaders(
    serviceId: string,
    serviceName: string,
    authHeader: string,
  ) {
    logMethodAccessTrace(this.validateHeaders.name);
    // SERVICE_ID
    if (serviceId !== SERVICE_ID) {
      const badServiceIdMessage = 'Service-Id is not correct';
      logger.error(badServiceIdMessage);
      throw new HttpErrors.BadRequest(badServiceIdMessage);
      // SERVICE_NAME
    } else if (serviceName !== SERVICE_NAME) {
      const badServiceNameMessage = 'Service-Name is not correct';
      logger.error(badServiceNameMessage);
      throw new HttpErrors.BadRequest(badServiceNameMessage);
      // AUTHORIZATION
    } else if (!authHeader) {
      const noTokenMessage = 'You must provide an authorization token';
      logger.error(noTokenMessage);
      throw new HttpErrors.BadRequest(noTokenMessage);
    }
    logger.info('Service headers validated successfuly');
  }

  // GRANT SERVICE AUTHORIZATION WITH OAUTH
  private async validateAccessToken(authHeader: string) {
    logMethodAccessDebug(this.validateAccessToken.name);
    try {
      // VALIDATE ACCESS TOKEN
      logger.debug(
        `Validating access token with Oauth service at ${OAUTH_SERVICE_URL}`,
      );
      await this.oauthService.checkAuthorization(
        authHeader,
        OAUTH_SERVICE_URL!,
      );
      logger.info('Communication with Oauth succeded. AccessToken validated.');
    } catch (err) {
      const statusCode = err.statusCode;
      if (!statusCode) {
        throw this.errorsService.setErrorResponse(
          "Communication with 'Oauth' service failed",
          err.message,
          503,
        );
      }
      let errObject: any;
      const statusInfo =
        "Something wrong happened accessing 'Oauth' at " +
        "'/checkAuthorization'";
      try {
        errObject = JSON.parse(err.message);
      } catch (e) {
        throw this.errorsService.setErrorResponse(statusInfo, err.message, 503);
      }
      if (statusCode >= 400 && statusCode < 500) {
        logger.warn('Response statusCode: ' + statusCode);
        throw this.authorizationErrorHandler(errObject);
      } else {
        logger.error('Response statusCode: ' + statusCode);
        throw this.errorsService.setErrorResponse(statusInfo, err.message, 503);
      }
    }
  }

  // AUTHORIZATION ERROR HANDLER
  private authorizationErrorHandler(error: any) {
    logMethodAccessDebug(this.authorizationErrorHandler.name);
    logger.warn('Oauth service answered: ' + error.message);
    switch (error.statusCode) {
      case 401:
        return new HttpErrors.Unauthorized(error.message);
      case 403:
        return new HttpErrors.Forbidden(error.message);
      default: {
        const unexpectedError =
          'Something wrong happened accessing Oauth at /checkAuthorization.';
        logger.error(unexpectedError + ' This error is not handled.');
        logger.error(JSON.stringify(error));
        return new HttpErrors.FailedDependency(unexpectedError);
      }
    }
  }
}
