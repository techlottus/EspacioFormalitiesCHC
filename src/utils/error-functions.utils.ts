import {HttpErrors} from '@loopback/rest';
import {logger} from '.';


export const schoolError = (school: string) => {
  const errorMessage = `Either school '${school}' doesn't have access ` +
    `to this service or it's not handled by this API`;
  logger.fatal(errorMessage);
  return new HttpErrors.BadRequest(errorMessage);
}

export const modalityError = (modality: string) => {
  const errorMessage = `Either modality '${modality}' doesn't have access ` +
    `to this service or it's not handled by this API`;
  logger.fatal(errorMessage);
  return new HttpErrors.BadRequest(errorMessage);
}

export const noDocFoundError = (
  collectionName: string,
  filter: object
) => {
  const errorMessage = `No documents found in '${collectionName}' collection ` +
    `with: ${JSON.stringify(filter)}`;
  logger.fatal(errorMessage);
  return new HttpErrors.NotFound(errorMessage);
}

export const missingPropertyError = (
  property: string
) => {
  const errorMessage = `Property '${property}' is missing in the requestBody`;
  logger.error(errorMessage);
  return new HttpErrors.UnprocessableEntity(errorMessage);
}

export const undefinedFieldInDoc = (
  field: string,
  filter: object,
  collectionName: string
) => {
  const errorMessage = `'${field}' is not defined in document fetched with ` +
    `this data '${JSON.stringify(filter)}' at ${collectionName} collection`;
  logger.fatal(errorMessage);
  return new HttpErrors.NotFound(errorMessage);
}

export const costsError = (
  detailId: string
) => {
  const errorMessage = `Costs service didn't answer with an object with ` +
    `detailId: ${detailId}`;
  logger.fatal(errorMessage);
  return new HttpErrors.NotFound(errorMessage);
}
