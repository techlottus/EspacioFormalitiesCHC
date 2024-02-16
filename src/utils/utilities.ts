////////////////////////////////////////////////////////
///////////////   UTILITIES   ////////////////

import {logger} from '.';
import {SUBSCHOOL, ULABYUANE, UTC, UTCBYUANE} from '../constants';
import {AcademicLevelsRepository} from '../repositories';

export const logMethodAccessInfo = (methodName: string) => {
  logger.info(`${methodName}() accessed`);
};

export const logMethodAccessDebug = (methodName: string) => {
  logger.debug(`${methodName}() accessed`);
};

export const logMethodAccessTrace = (methodName: string) => {
  logger.trace(`${methodName}() accessed`);
};

export const logNoDocFound = (
  collectionName: string,
  filter: object
) => {
  logger.warn(`No documents found in '${collectionName}' collection ` +
    `with: ${JSON.stringify(filter)}`);
  return true;
}

// NUMERIC ID GENERATOR 16 DIGITS
export const createId = (input_string: string): number => {
  let used_string = input_string.replace(/ /g, ''); // removes white spaces
  used_string = used_string.toUpperCase(); // to uppercase
  let id_as_string = '';
  for (let i = 0; i < used_string.length; i++) {
    id_as_string = id_as_string + used_string.charCodeAt(i); // creates id as a string
  }
  id_as_string = id_as_string.slice(-16); // crops string
  const id_as_number = Number(id_as_string); // id to number
  return id_as_number;
};

// RETURNS DATE AS STRING: yyyy-mm-dd
export const dateString = () => {
  const pad = (num: number) => (num < 10 ? '0' + num : num);
  const date = new Date();
  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-');
};

// RETURNS TIME AS STRING
export const getTime = () => {
  const date = new Date();
  const time = date.toLocaleTimeString();
  return time;
};

// String id for picklist values
export const createIdWithPrefix = (
  prefix: string,
  inputString: string,
): string => {
  const listWords = inputString.toUpperCase().split(' ');
  let identifier = '';
  listWords.forEach(word => {
    identifier += word.charAt(0) + word.length;
  });
  identifier = prefix.substring(0, 3).toUpperCase() + identifier;
  if (listWords.length === 1) {
    const word = listWords[0];
    identifier += word.charAt(word.length - 1);
  }
  return identifier;
};

// STRING TO DATE CONVERTER
export const parseDate = (input: string) => {
  const parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(+parts![0], +parts![1] - 1, +parts![2]); // months are 0-based
};

//change name of school to 'UTCBYUANE' or 'ULABYUANE' if are the modalities  1T, BO, 1P and school
export const changeSchoolNameByModality = async (
  levelCode: string,
  school: string,
  academicLevelsRepository: AcademicLevelsRepository,
) => {
  const levelsFilter = {school, identifier: SUBSCHOOL};
  const levelsDoc = await academicLevelsRepository.findOne({
    where: levelsFilter,
  });
  return levelsDoc?.levels.includes(levelCode)
    ? school === UTC
      ? UTCBYUANE
      : ULABYUANE
    : school;
};
