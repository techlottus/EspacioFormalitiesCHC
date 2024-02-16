////////////////////////////////////////////////////
//////     Salesforce services constants      //////
////////////////////////////////////////////////////

import {logUndefinedUrlToMongo} from '../services';
import {logger} from '../utils';

// URLs
export const SF_CORE_URL = process.env.SF_CORE_URL
if (!SF_CORE_URL) {
  const varName = Object.keys({SF_CORE_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const SF_PICKLIST_UTC_URL = process.env.SF_PICKLIST_UTC_URL
if (!SF_PICKLIST_UTC_URL) {
  const varName = Object.keys({SF_PICKLIST_UTC_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const SF_PICKLIST_ULA_URL = process.env.SF_PICKLIST_ULA_URL
if (!SF_PICKLIST_ULA_URL) {
  const varName = Object.keys({SF_PICKLIST_ULA_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const SF_PROCEDURE_REQUEST_UTC_URL = process.env.SF_PROCEDURE_REQUEST_UTC_URL
if (!SF_PROCEDURE_REQUEST_UTC_URL) {
  const varName = Object.keys({SF_PROCEDURE_REQUEST_UTC_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const SF_PROCEDURE_REQUEST_ULA_URL = process.env.SF_PROCEDURE_REQUEST_ULA_URL
if (!SF_PROCEDURE_REQUEST_ULA_URL) {
  const varName = Object.keys({SF_PROCEDURE_REQUEST_ULA_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const SF_PROCEDURE_REQUEST_UTEG_URL = process.env.SF_PROCEDURE_REQUEST_UTEG_URL
if (!SF_PROCEDURE_REQUEST_ULA_URL) {
  const varName = Object.keys({SF_PROCEDURE_REQUEST_ULA_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}
