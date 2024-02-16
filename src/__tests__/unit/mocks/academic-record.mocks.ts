import {
  getAcademicRecordStatusOk, postAcademicRecordStatusOk
} from '../../../constants';
import {CommonServiceFields_UTC} from '../../../interfaces';
import {CommonsRB, SSCHCResponse} from '../../../models';
import {campusArray, deliveryArray} from '../../mocks/common.mocks';

export const academicRecordResponse = new SSCHCResponse()
academicRecordResponse.data = {
  delivery: deliveryArray,
  campus: campusArray,
};
academicRecordResponse.status = {
  id: 200,
  info: getAcademicRecordStatusOk
};

export const academicRecordRequestBody = new CommonsRB({
  "delivery": null,
  "campus": '0',
  "phoneNumber": "string",
  "chargeAccepted": true,
  "comments": null,
  "files": []
});

export const servicioFields: CommonServiceFields_UTC = {
  Nombre_de_la_cuenta__c: 'rene alborn',
  Correo_Institucional_UTC__c: "ricardo.cervantes@edu.utc.mx",
  Matricula__c: "220055315",
  Campus_UTC__c: "PLANTEL COACALCO",
  Nivel_UTC__c: "BACHILLERATO",
  Programa_UTC__c: "BACH TECNOLÓGICO EN TURISMO",
  Modalidad_UTC__c: "A Distancia",
  Numero_de_telefono__c: "1234567890",
  Tipo_de_Entrega_UTC__c: "Entrega en Campus",
  Selecciona_Campus_UTC__c: "",
  Acepto_el_Cargo__c: true,
  Comentarios__c: null,
  Etapa_UTC__c: "Nuevo",
  Asignar_mediante_las_reglas__c: true
};

export const ticketNumberDummy = "03453323";

export const transNumberDummy = 1234;

export const postAcademicRecordResponseMock = new SSCHCResponse()
postAcademicRecordResponseMock.data = {
  ticketNumber: ticketNumberDummy,
  transactionNumber: transNumberDummy
}
postAcademicRecordResponseMock.status = {
  id: 201,
  info: postAcademicRecordStatusOk
}
