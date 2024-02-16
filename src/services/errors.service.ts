import {BindingScope, inject, injectable} from '@loopback/core';
import {Response, RestBindings} from '@loopback/rest';
import {errorChcObject, logMethodAccessTrace, logger} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class ErrorsService {
  constructor(
    @inject(RestBindings.Http.RESPONSE)
    private res: Response
  ) { }

  setErrorResponse(
    statusInfo: string,
    errorInfo: string,
    errorCode: number,
  ) {
    logMethodAccessTrace(this.setErrorResponse.name);
    logger.error(statusInfo);
    logger.error(errorInfo);
    return this.res.status(errorCode).send(errorChcObject(
      statusInfo,
      errorInfo,
      errorCode
    ));
  }

  setHttpErrorResponse(
    statusCode: number,
    errorMessage: string,
    requestObject: string,
    serviceName: string
  ) {
    logMethodAccessTrace(this.setHttpErrorResponse.name);
    logger.error(`Response statusCode: ${statusCode}`);
    let errorInfo = errorMessage;
    let statusInfo: string
    try {
      const responseObject = JSON.parse(errorMessage);
      if (responseObject.message) {
        errorInfo =
          `'${serviceName}' service response: '${responseObject.message}'`;
      }
      statusInfo = `Something wrong happened requesting '${requestObject}'`;
    } catch (e) {
      statusInfo = `Communication with '${serviceName}' service failed, ` +
        `'${requestObject}' couldn't be fetched`;
    }
    logger.error(statusInfo);
    logger.error(errorInfo);
    const definedStatusCode = statusCode ?? 503;
    return this.res.status(definedStatusCode).send(errorChcObject(
      statusInfo,
      errorInfo,
      definedStatusCode,
    ));
  }
}
