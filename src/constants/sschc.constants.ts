////////////////////////////////////////////////
//////     SS-CHC service constants      ///////
////////////////////////////////////////////////

import {logNotDefinedEV, logUndefinedUrlToMongo} from '../services';
import {logger} from '../utils';

// SERVICE VARIABLES
export const SERVICE_ID =
  process.env.SERVICE_ID ?? 'virtual-campus-school-services-consthistcert-api';
if (!process.env.SERVICE_ID) logNotDefinedEV('SERVICE_ID');
export const SERVICE_NAME =
  process.env.SERVICE_NAME ?? 'School Services - ConstHistCert API';
if (!process.env.SERVICE_NAME) logNotDefinedEV('SERVICE_NAME');

// REMOTE DB URL
export const REMOTE_DB = process.env.REMOTE_DB;
if (!process.env.REMOTE_DB) logNotDefinedEV('REMOTE_DB');

// OAUTH URL
export const OAUTH_SERVICE_URL = process.env.OAUTH_SERVICE_URL;
if (!process.env.OAUTH_SERVICE_URL) {
  const varName = Object.keys({OAUTH_SERVICE_URL})[0];
  logUndefinedUrlToMongo(varName).catch(err => {
    logger.error(JSON.stringify(err));
  });
}

// OAUTH URL
export const PAYLOAD_LIMIT_SIZE = process.env.PAYLOAD_LIMIT_SIZE;
if (!process.env.PAYLOAD_LIMIT_SIZE) {
  const varName = Object.keys({PAYLOAD_LIMIT_SIZE})[0];
  logUndefinedUrlToMongo(varName).catch(err => {
    logger.error(JSON.stringify(err));
  });
}

// OAUTH URL
export const MAX_LIMIT_SIZE = process.env.MAX_LIMIT_SIZE;
if (!process.env.MAX_LIMIT_SIZE) {
  const varName = Object.keys({MAX_LIMIT_SIZE})[0];
  logUndefinedUrlToMongo(varName).catch(err => {
    logger.error(JSON.stringify(err));
  });
}
