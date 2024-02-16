///////////////////////// LoggerService /////////////////////////
// Exports a logger function that creates a logs file in pathName
/////////////////////////////////////////////////////////////////

import {configure, getLogger} from 'log4js';

configure({
  appenders: {
    out: {type: 'stdout'},
    logFiles: {
      type: 'multiFile',
      base: 'logs/',
      property: 'pathName',
      extension: '.log',
    },
  },
  categories: {
    default: {
      appenders: ['logFiles', 'out'],
      level: process.env.LOGGER_LEVEL ?? 'debug',
    },
  },
});

let logsEmail = '';

export const setLogsEmail = (email: string) => logsEmail = email;

const serviceName = 'SS-CHC';

const setLog = getLogger(serviceName);

export class logger {
  static trace(message: string) {
    this.setPathName();
    setLog.trace(logsEmail + ': ' + message);
  }
  static debug(message: string) {
    this.setPathName();
    setLog.debug(logsEmail + ': ' + message);
  }
  static info(message: string) {
    this.setPathName();
    setLog.info(logsEmail + ': ' + message);
  }
  static warn(message: string) {
    this.setPathName();
    setLog.warn(logsEmail + ': ' + message);
  }
  static error(message: string) {
    this.setPathName();
    setLog.error(logsEmail + ': ' + message);
  }
  static fatal(message: string) {
    this.setPathName();
    setLog.fatal(logsEmail + ': ' + message);
  }

  private static setPathName() {
    setLog.addContext('pathName', this.getPathName());
  }
  private static getPathName = () => {
    const date = new Date();
    let day: number | string = date.getDate();
    if (day < 10) day = '0' + day;
    let month: number | string = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    const year = date.getFullYear();
    const dir = `${year}-${month}/`;
    const monthString = date.toLocaleString('default', {month: 'long'});
    const fileName = `${serviceName}--${day}-${monthString}-${year}`;
    const pathName = dir + fileName;
    return pathName;
  }
};
