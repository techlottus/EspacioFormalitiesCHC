import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CommonPropertiesService} from '.';
import {
  EJECUTIVA,
  ESCOLARIZADA,
  ONLINE,
  STUDY_CERTIFICATE_COLLECTION_NAME,
  TIPO_DE_CERTIFICADO_TOTAL,
  TOTAL_STUDY_CERT_VALUE,
  ULA,
  UTC
} from '../constants';
import {
  CertificateServiceFields_UTEG,
  StudentData,
  StudyCertificateServiceFields_UTC,
  StudyCertificate_ULA
} from '../interfaces';
import {StudyCertificateRB} from '../models';
import {StudyCertificateRepository} from '../repositories';
import {
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
  missingPropertyError,
  modalityError,
  noDocFoundError,
  schoolError,
  undefinedFieldInDoc
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class StudyCertificatePostService {
  constructor(
    @repository(StudyCertificateRepository)
    protected studyCertificateRepository: StudyCertificateRepository,
    @service(CommonPropertiesService)
    public commonPropertiesService: CommonPropertiesService,
  ) { }

  // SETS 'SERVICIO' PROPERTIES FOR STUDY CERTIFICATE
  async setStudyCertificateServiceProperties(
    studentData: StudentData,
    requestBody: StudyCertificateRB,
  ) {
    logMethodAccessTrace(this.setStudyCertificateServiceProperties.name);
    const {school, modality} = studentData;
    logger.debug(`School: ${school}, modality: ${modality}`);
    switch (school) {
      case UTC:
        return this.setStudyCertificatePropertiesUtc(
          studentData,
          requestBody
        );
      case ULA:
        const studyCertificatePropertiesUla =
          await this.setStudyCertificatePropertiesUla(
            studentData,
            requestBody
          );
        logger.debug(`StudyCertificate servicio properties setted:
         ${JSON.stringify(studyCertificatePropertiesUla)}`);
        return studyCertificatePropertiesUla;
      default:
        throw schoolError(school);
    }
  }

  // SETS 'SERVICIO' PROPERTIES FOR STUDY CERTIFICATE
  async setStudyCertificatePropertiesUtc(
    studentData: StudentData,
    requestBody: StudyCertificateRB,
  ) {
    logMethodAccessDebug(this.setStudyCertificatePropertiesUtc.name);
    const commonServiceFields = await this.commonPropertiesService.
      setCommonPropertiesUtcWithDeliveryAndCampus(
        studentData,
        requestBody,
      );
    const studyCertificateType = requestBody.studyCertificateType;
    if (!studyCertificateType)
      throw missingPropertyError('studyCertificateType');
    const studyCertificateServiceFields: StudyCertificateServiceFields_UTC = {
      ...commonServiceFields,
      Tipo_de_Certificado__c: await this.setStudyCertificate(
        studentData.school,
        studyCertificateType
      )
    };

    // IF STUDY CERT TYPE IS "TOTAL", THEN ASSIGN TYPE OF TOTAL STUDY CERT
    if (studyCertificateType === TOTAL_STUDY_CERT_VALUE) {
      const {studyCertificateTotalType} = requestBody;
      if (!studyCertificateTotalType)
        throw missingPropertyError('studyCertificateTotalType')
      Object.assign(studyCertificateServiceFields, {
        Tipo_de_Solicitud_de_Certificado_UTC__c:
          await this.setTotalStudyCertificate(
            UTC,
            studyCertificateTotalType,
          ),
      });
    }
    logger.debug(
      `StudyCertificate servicio properties setted:
      ${JSON.stringify(studyCertificateServiceFields)}`,
    );
    return studyCertificateServiceFields;
  }

  private async setStudyCertificatePropertiesUla(
    studentData: StudentData,
    requestBody: StudyCertificateRB,
  ) {
    logMethodAccessDebug(this.setStudyCertificatePropertiesUla.name);
    logger.debug(`requestBody: ${JSON.stringify(requestBody)}`);
    const {school, modality} = studentData
    const commonsServiceFields = await this.commonPropertiesService.
      setCommonPropertiesUlaWithDeliveryAndCampus(
        studentData,
        requestBody
      );
    switch (modality) {
      case ONLINE:
      case EJECUTIVA:
        return commonsServiceFields;
      case ESCOLARIZADA:
        const {studyCertificateType, studyCertificateTotalType} = requestBody;
        if (!studyCertificateType)
          throw missingPropertyError('studyCertificateType');
        const studyCertificateServiceFields: StudyCertificate_ULA = {
          ...commonsServiceFields,
          Tipo_de_Certificado_TRADICIONAL__c: await this.setStudyCertificate(
            school, studyCertificateType)
        }
        // IF STUDY CERT TYPE IS "TOTAL", THEN ASSIGN KIND OF TOTAL STUDY CERT
        if (studyCertificateType === TOTAL_STUDY_CERT_VALUE) {
          if (!studyCertificateTotalType)
            throw missingPropertyError('studyCertificateTotalType');
          Object.assign(studyCertificateServiceFields, {
            Tipo_de_Solicitud_de_Certiiiificado_UTC__c:
              await this.setTotalStudyCertificate(
                school,
                studyCertificateTotalType,
              ),
          });
        }
        return studyCertificateServiceFields;
      default:
        throw modalityError(modality);
    }
  }

  async setStudyCertificateServiceProperties_UTEG(
    studentData: StudentData,
    requestBody: StudyCertificateRB,
  ): Promise<CertificateServiceFields_UTEG> {
    logMethodAccessInfo(this.setStudyCertificateServiceProperties_UTEG.name);
    const commonServiceProperties =
      this.commonPropertiesService.setCommonPropertiesUteg(
        studentData,
        requestBody
      );
    const certificateValue = requestBody.studyCertificateType;
    if (!certificateValue)
      throw missingPropertyError('studyCertificateType');
    const certificateServiceObject: CertificateServiceFields_UTEG = {
      ...commonServiceProperties,
      UTEG_Tipo_de_Certificado__c: await this.setStudyCertificate(
        studentData.school,
        certificateValue
      )
    };
    logger.debug(`Study certificate properties setted`);
    return certificateServiceObject;
  }

  // SETS STUDY CERTIFICATE TYPE
  private async setStudyCertificate(
    school: string,
    studyCertificateValue: string,
  ): Promise<string> {
    logMethodAccessTrace(this.setStudyCertificate.name);
    const filter = {school, value: studyCertificateValue};
    const studyCertificateDocument =
      await this.studyCertificateRepository.findOne({where: filter});
    if (!studyCertificateDocument)
      throw noDocFoundError(
        STUDY_CERTIFICATE_COLLECTION_NAME,
        filter
      );
    const {label} = studyCertificateDocument;
    if (!label) throw undefinedFieldInDoc(
      'label',
      filter,
      STUDY_CERTIFICATE_COLLECTION_NAME
    );
    logger.debug(
      `StudyCertificate found.Value: ${studyCertificateValue}, Label: ${label}`
    );
    return label;
  }

  // SETS TOTAL STUDY CERTIFICATE TYPE
  private async setTotalStudyCertificate(
    school: string,
    value: string,
  ): Promise<string> {
    logMethodAccessTrace(this.setTotalStudyCertificate.name);
    const filter = {
      school,
      identifier: TIPO_DE_CERTIFICADO_TOTAL,
      value: value
    }
    const totalStudyCertificateDocument =
      await this.studyCertificateRepository.findOne({
        where: filter,
      });
    if (!totalStudyCertificateDocument)
      throw noDocFoundError(
        STUDY_CERTIFICATE_COLLECTION_NAME,
        filter
      );
    const {label} = totalStudyCertificateDocument;
    if (!label) throw undefinedFieldInDoc(
      'label',
      filter,
      STUDY_CERTIFICATE_COLLECTION_NAME
    );
    logger.debug(
      `StudyCertificateTotal found.Value: ${value}, Label: ${label} `
    );
    return label;
  }
}
