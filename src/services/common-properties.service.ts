/////////////////// CommonPropertiesService ////////////////////
// Salesforce ServiciosEscolares POST endpoint accepts objects with 4 properties
// defined in SfRequestBody interface
// This service sets fields to one of those 4 properties ("servicio")
////////////////////////////////////////////////////////////////

import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  CAMPUS_COLLECTION_NAME,
  CAMPUS_DELIVERY_VALUE,
  DELIVERY_COLLECTION_NAME,
} from '../constants';
import {
  CommonServiceFields_ULA,
  CommonServiceFields_UTC,
  CommonServiceFields_UTEG,
  StudentData,
} from '../interfaces';
import {CommonsRB} from '../models';
import {CampusRepository, DeliveryRepository} from '../repositories';
import {
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
  noDocFoundError
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class CommonPropertiesService {
  constructor(
    @repository(DeliveryRepository)
    protected deliveryRepository: DeliveryRepository,
    @repository(CampusRepository)
    protected campusRepository: CampusRepository,
  ) { }

  async fetchDeliveryAndCampusArrays(school: string) {
    logMethodAccessTrace(this.fetchDeliveryAndCampusArrays.name);
    const delivery =
      await this.deliveryRepository.fetchDeliveryWithSchool(school);
    const campus = await this.campusRepository.fetchCampusArray(school);
    return {delivery, campus};
  }

  async fetchDeliveryWithQrAndCampusArrays(school: string) {
    logMethodAccessTrace(this.fetchDeliveryAndCampusArrays.name);
    const delivery =
      await this.deliveryRepository.fetchDeliveryWithQr();
    const campus = await this.campusRepository.fetchCampusArray(school);
    return {delivery, campus};
  }

  setCommonPropertiesUtc(
    studentData: StudentData,
    requestBody: CommonsRB,
    serviceName?: string
  ): CommonServiceFields_UTC {
    logMethodAccessDebug(this.setCommonPropertiesUtc.name);
    const {files, ...bodyWithoutFiles} = requestBody;
    logger.debug(
      `requestBody (without files array): ${JSON.stringify(bodyWithoutFiles)}`,
    );
    const commonServiceFields: CommonServiceFields_UTC = {
      Nombre_de_la_cuenta__c: studentData.name,
      Correo_Institucional_UTC__c: studentData.email,
      Matricula__c: studentData.enrollmentNumber,
      Campus_UTC__c: studentData.campus,
      Nivel_UTC__c: studentData.level,
      Programa_UTC__c: studentData.program,
      Modalidad_UTC__c: studentData.modality,
      Numero_de_telefono__c: requestBody.phoneNumber ?? studentData.phoneNumber,
      Acepto_el_Cargo__c: requestBody.chargeAccepted!,
      Comentarios__c: requestBody.comments,
      Etapa_UTC__c: 'Nuevo',
      Asignar_mediante_las_reglas__c: true,
    };
    if (serviceName)
      logger.debug(`${serviceName} service properties setted: ` +
        `${JSON.stringify(commonServiceFields)}`);
    return commonServiceFields;
  }

  async setCommonPropertiesUtcWithDeliveryAndCampus(
    studentData: StudentData,
    requestBody: CommonsRB,
    serviceName?: string
  ) {
    let commonServiceFields = this.setCommonPropertiesUtc(
      studentData,
      requestBody
    );
    commonServiceFields.Tipo_de_Entrega_UTC__c = await this.setDeliveryLabel(
      studentData.school,
      requestBody.delivery,
    );
    commonServiceFields.Selecciona_Campus_UTC__c = await this.setCampusLabel(
      studentData.school,
      requestBody.campus,
    );
    if (serviceName)
      logger.debug(`${serviceName} service properties setted: ` +
        `${JSON.stringify(commonServiceFields)}`);
    return commonServiceFields;
  }

  setCommonPropertiesUla(
    studentData: StudentData,
    requestBody: CommonsRB,
    serviceName?: string
  ): CommonServiceFields_ULA {
    logMethodAccessTrace(this.setCommonPropertiesUla.name);
    const {files, ...bodyWithoutFiles} = requestBody;
    logger.debug(
      `requestBody (without files array): ${JSON.stringify(bodyWithoutFiles)}`,
    );
    logger.info('Body aprox size:' + JSON.stringify(requestBody).length);
    const commonServiceFields: CommonServiceFields_ULA = {
      Nombre_de_la_cuenta__c: studentData.name,
      Email_en_RFI__c: studentData.email,
      Matricula__c: studentData.enrollmentNumber,
      Campus_Banner__c: studentData.campus,
      Nivel_Banner__c: studentData.level,
      Programa_ONLINE_Banner__c: studentData.program,
      Numero_de_telefono__c: requestBody.phoneNumber ?? studentData.phoneNumber,
      Acepto_el_Cargo__c: true,
      Comentarios__c: requestBody.comments,
      Status__c: 'Nuevo',
      Asignar_mediante_las_reglas__c: true,
    };
    if (serviceName)
      logger.debug(`${serviceName} service properties setted: ` +
        `${JSON.stringify(commonServiceFields)}`);
    return commonServiceFields;
  }

  async setCommonPropertiesUlaWithDeliveryAndCampus(
    studentData: StudentData,
    requestBody: CommonsRB,
    serviceName?: string
  ) {
    logMethodAccessInfo(this.setCommonPropertiesUlaWithDeliveryAndCampus.name);
    let commonServiceFields = this.setCommonPropertiesUla(
      studentData,
      requestBody
    );
    commonServiceFields.Forma_de_Entrega__c = await this.setDeliveryLabel(
      studentData.school,
      requestBody.delivery,
    );
    commonServiceFields.Selecciona_Campus__c = await this.setCampusLabel(
      studentData.school,
      requestBody.campus,
    );
    if (serviceName)
      logger.debug(`${serviceName} service properties setted: ` +
        `${JSON.stringify(commonServiceFields)}`);
    return commonServiceFields;
  }

  setCommonPropertiesUteg(
    studentData: StudentData,
    requestBody: CommonsRB,
    serviceName?: string
  ): CommonServiceFields_UTEG {
    logMethodAccessDebug(this.setCommonPropertiesUteg.name);
    const {files, ...bodyWithoutFiles} = requestBody;
    logger.debug(
      `requestBody (without files array): ${JSON.stringify(bodyWithoutFiles)}`,
    );
    const commonServiceFields: CommonServiceFields_UTEG = {
      Nombre_de_la_cuenta__c: studentData.name,
      Email_en_RFI__c: studentData.email,
      Matricula__c: studentData.enrollmentNumber,
      Nivel_Banner__c: studentData.level,
      Campus_Banner__c: studentData.campus,
      Programa_ONLINE_Banner__c: studentData.program,
      Numero_de_telefono__c: requestBody.phoneNumber ?? studentData.phoneNumber,
      Acepto_el_Cargo__c: true,
      Comentarios__c: requestBody.comments,
      Status__c: 'Nuevo',
      Asignar_mediante_las_reglas__c: true,
    };
    if (requestBody.delivery)
      commonServiceFields.Forma_de_Entrega__c = requestBody.delivery;
    if (serviceName)
      logger.debug(`${serviceName} service properties setted: ` +
        `${JSON.stringify(commonServiceFields)}`);
    return commonServiceFields;

  }

  // SETS DELIVERY TYPE
  async setDeliveryLabel(
    school: string,
    deliveryValue: string | null | undefined,
  ): Promise<string> {
    logMethodAccessTrace(this.setDeliveryLabel.name);
    if (!deliveryValue) {
      deliveryValue = CAMPUS_DELIVERY_VALUE;
      logger.debug(`deliveryValue setted to '${CAMPUS_DELIVERY_VALUE}'`);
    }
    const filter = {school, value: deliveryValue};
    const delivery = await this.deliveryRepository.findOne({
      where: filter,
    });
    if (!delivery) throw noDocFoundError(DELIVERY_COLLECTION_NAME, filter);
    const deliveryLabel = delivery.label;
    logger.debug(
      `Delivery found. Value: ${deliveryValue}, Label: ${deliveryLabel}`,
    );
    return deliveryLabel;
  }

  // SETS CAMPUS FOR THE SELECT FIELD
  async setCampusLabel(
    school: string,
    campusValue: string | null | undefined,
  ): Promise<string> {
    logMethodAccessTrace(this.setCampusLabel.name);
    if (!campusValue) return '';
    const filter = {school, value: campusValue};
    const campusDocument = await this.campusRepository.findOne({
      where: filter,
    });
    if (!campusDocument) throw noDocFoundError(CAMPUS_COLLECTION_NAME, filter);
    const {label} = campusDocument;
    logger.debug(`Campus found. Value: ${campusValue}, Label: ${label}`);
    return label;
  }
}
