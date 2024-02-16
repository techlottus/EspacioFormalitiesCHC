import {HttpErrors} from '@loopback/rest';
import jwt from 'jsonwebtoken';
import {logger} from '.';
import {EJECUTIVA, ONLINE} from '../constants';
import {StudentData} from '../interfaces';

// RETURNS TOKEN'S PAYLOAD
export const tokenDecoder = (authHeader: string) => {
  if (!authHeader) {
    logger.error("No accessToken provided");
    throw new HttpErrors.BadRequest('You must provide an access token');
  }
  const decodedToken: any = jwt.decode(authHeader.replace('Bearer ', ''));
  if (!decodedToken) {
    const errorMessage = "This API was unable to decode accessToken";
    logger.fatal(errorMessage);
    throw new HttpErrors.BadRequest(errorMessage);
  }
  return decodedToken;
};

export const getStudentData = (authHeader: string) => {
  const decodedToken = tokenDecoder(authHeader);
  const studentData: StudentData = {
    name: decodedToken.name,
    email: decodedToken.email,
    enrollmentNumber: decodedToken.studentEnrollmentNumber,
    campus: decodedToken.campus,
    campusSf: decodedToken.campusSf,
    campusId: decodedToken.campusId,
    phoneNumber: decodedToken.phoneNumber,
    level: decodedToken.academicLevel,
    levelCode: decodedToken.academicLevelCode,
    program: decodedToken.program,
    modality: decodedToken.modality,
    studentId: decodedToken.studentId,
    periodCode: decodedToken.periodCode,
    school: decodedToken.webApp?.school,
    cuatrimestre: decodedToken.cuatrimestre,
  };
  let key: keyof StudentData;
  for (key in studentData) {
    if (studentData[key] === undefined) {
      logger.warn(
        `${studentData.email}: '${key}' is not present in the accessToken!`
      );
    }
  }
  if (studentData.modality === EJECUTIVA) studentData.modality = ONLINE;
  return studentData;
};
