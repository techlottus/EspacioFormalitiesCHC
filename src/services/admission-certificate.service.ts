import {BindingScope, injectable, service} from '@loopback/core';
import {CommonPropertiesService} from '.';
import {ULA} from '../constants';
import {AdmissionCertificate_ULA, StudentData} from '../interfaces';
import {AdmissionCertRequestBody} from '../models';
import {
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
  schoolError
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class AdmissionCertificateService {
  constructor(
    @service(CommonPropertiesService)
    protected commonPropertiesService: CommonPropertiesService,
  ) { }

  setAdmissionCertificateServiceProperties(
    studentData: StudentData,
    requestBody: AdmissionCertRequestBody,
  ) {
    logMethodAccessTrace(this.setAdmissionCertificateServiceProperties.name);
    const {school} = studentData;
    switch (school) {
      case ULA:
        return this.setAdmissionCertificatePropertiesUla(
          studentData,
          requestBody,
        )
      default:
        throw schoolError(school);
    }
  }

  private setAdmissionCertificatePropertiesUla(
    studentData: StudentData,
    requestBody: AdmissionCertRequestBody,
  ) {
    logMethodAccessInfo(this.setAdmissionCertificatePropertiesUla.name);
    const commonProperties =
      this.commonPropertiesService.setCommonPropertiesUla(
        studentData,
        requestBody
      );
    const admissionCertProperties: AdmissionCertificate_ULA = {
      ...commonProperties,
      Pa_s_de_Nacimiento__c: requestBody.countryOfBirth,
      Pa_s_de_Estudios_Inmediatos_Anteriores__c: requestBody.countryOfPriorStudies,
      Nombre_Escuela_de_Procedencia__c: requestBody.schoolOfOrigin,
      Fecha_Inicio_Admision__c: requestBody.dateStudiesStarted,
      Fecha_Fin_Admision__c: requestBody.dateStudiesFinished
    };
    logger.debug(`Admission Certificate properties setted: ` +
      `${JSON.stringify(admissionCertProperties)}`);
    return admissionCertProperties;
  }
}
