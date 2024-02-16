import {Files64} from '../models';

export interface StudentData {
  name: string;
  email: string;
  enrollmentNumber: string;
  campus: string;
  campusSf: string;
  campusId: string;
  phoneNumber: string;
  level: string;
  levelCode: string;
  program: string;
  modality: string;
  studentId: string;
  periodCode: string;
  school: string;
  cuatrimestre: string;
};

export interface SfRequestBody {
  servicio: object,
  files: Files64[],
  matricula: string,
  recordtype: string
}

export interface CampusServiceInterface {
  id: string;
  name: string;
}

export interface CalendarsObject {
  desk: object,
  mobile: object
}
