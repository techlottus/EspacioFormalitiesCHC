////////////////////////////////////////////////////
//////      Payments service constants        //////
////////////////////////////////////////////////////

import {logUndefinedUrlToMongo} from '../services';
import {logger} from '../utils';

// URLS
export const PAYMENTS_SERVICE_URL = process.env.PAYMENTS_SERVICE_URL
if (!process.env.PAYMENTS_SERVICE_URL) {
  const varName = Object.keys({PAYMENTS_SERVICE_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const COSTS_SERVICE_URL = process.env.COSTS_SERVICE_URL
if (!process.env.COSTS_SERVICE_URL) {
  const varName = Object.keys({COSTS_SERVICE_URL})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

// PAYMENTS SERVICE VARIABLES
export const PAYMENTS_SERVICE_ID = process.env.PAYMENTS_SERVICE_ID ?? "virtual-campus-payment-api";
if (!process.env.PAYMENTS_SERVICE_ID) {
  const varName = Object.keys({PAYMENTS_SERVICE_ID})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}

export const PAYMENTS_SERVICE_NAME = process.env.PAYMENTS_SERVICE_NAME ?? "Payment Service API";
if (!process.env.PAYMENTS_SERVICE_NAME) {
  const varName = Object.keys({PAYMENTS_SERVICE_NAME})[0]
  logUndefinedUrlToMongo(varName)
    .catch((err) => {
      logger.error(JSON.stringify(err));
    });
}
