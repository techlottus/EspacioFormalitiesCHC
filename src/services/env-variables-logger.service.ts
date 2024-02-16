////////// LOG NOT DEFINED ENVIRONMENT VARIABLE ////////
////////////////////////////////////////////////////////

import {MongodbLottusEducationDataSource} from '../datasources';
import {BackLogs} from '../models';
import {BackLogsRepository} from '../repositories';
import {dateString, getTime, logger} from '../utils';

// REGULAR LOG WHEN AN ENV VAR IS NOT DEFINED
export const logNotDefinedEV = (varName: string) => {
  logger.warn(`${varName} environment variable is not defined.`);
};

// CREATES A REGISTER IN A MONGO COLLECTION WHEN A URL VAR IS NOT DEFINED
export const logUndefinedUrlToMongo = async (varName: string) => {
  const ENVIRONMENT = process.env.ENVIRONMENT ?? 'undefined'
  if (!process.env.ENVIRONMENT) logNotDefinedEV('ENVIRONMENT');
  const varNotDefinedRegister = new BackLogs({
    description: `Variable '${varName}' is not defined`,
    variable: varName,
    date: dateString(),
    time: getTime(),
    environment: ENVIRONMENT
  });
  if (!process.env.TEST) {
    const backLogsRepository = new BackLogsRepository(
      new MongodbLottusEducationDataSource()
    );
    await backLogsRepository.create(varNotDefinedRegister);
  }
  logNotDefinedEV(varName);
};
