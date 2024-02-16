import {SSCHCResponse} from '../models';
import {logger} from './logger';

export const errorChcObject = (
  statusInfo: string,
  errorInfo: string,
  errorId: number,
) => {
  const errorResponseObject = new SSCHCResponse();
  errorResponseObject.status = {
    info: statusInfo
  };
  errorResponseObject.error = {
    id: errorId,
    info: errorInfo
  };
  return errorResponseObject;
}

export const successfulChcObject = (
  data: any,
  statusId: number,
  statusInfo: string
) => {
  const responseObject = new SSCHCResponse();
  responseObject.data = data;
  responseObject.status = {
    id: statusId,
    info: statusInfo
  }
  logger.info(statusInfo);
  return responseObject;
}
