////////////////////////////////////////////////////
//////      Permissions service constants        //////
////////////////////////////////////////////////////

import {logUndefinedUrlToMongo} from '../services';
import {logger} from '../utils';

export const PERMISSIONS_ID = 'virtual-campus-permission-api';

export const PERMISSIONS_SERVICE_CAMPUS_URL =
  process.env.PERMISSIONS_SERVICE_CAMPUS_URL;
if (!PERMISSIONS_SERVICE_CAMPUS_URL) {
  const varName = Object.keys({PERMISSIONS_SERVICE_CAMPUS_URL})[0];
  logUndefinedUrlToMongo(varName).catch(err => {
    logger.error(JSON.stringify(err));
  });
}

export const REPORT_CARD_SERVICE_URL =
  process.env.REPORT_CARD_SERVICE_URL;
if (!REPORT_CARD_SERVICE_URL) {
  const varName = Object.keys({REPORT_CARD_SERVICE_URL})[0];
  logUndefinedUrlToMongo(varName).catch(err => {
    logger.error(JSON.stringify(err));
  });
}

export const ACADEMIC_HISTORY_SERVICE_URL =
  process.env.ACADEMIC_HISTORY_SERVICE_URL;
if (!ACADEMIC_HISTORY_SERVICE_URL) {
  const varName = Object.keys({ACADEMIC_HISTORY_SERVICE_URL})[0];
  logUndefinedUrlToMongo(varName).catch(err => {
    logger.error(JSON.stringify(err));
  });
}
