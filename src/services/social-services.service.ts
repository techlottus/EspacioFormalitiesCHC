import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CommonPropertiesService} from '.';
import {
  PROGRAMA_DE_ULA_ID,
  SOCIAL_SERVICE_COLLECTION_NAME,
  SOCIAL_SERVICE_REQUIREMENTS,
  ULA,
  registerCompanyFormatLinkId,
  registeredInstitutionsLinkId,
  socialServiceRequirementsLinkId
} from '../constants';
import {
  CommonServiceFields_ULA,
  SocialServiceProgramaULAServicioFields_ULA,
  StudentData
} from '../interfaces';
import {SocialServiceRB} from '../models';
import {SocialServiceRepository} from '../repositories';
import {
  logMethodAccessDebug,
  logMethodAccessTrace,
  logger,
  missingPropertyError,
  noDocFoundError,
  schoolError
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class SocialServicesService {
  constructor(
    @repository(SocialServiceRepository)
    protected socialServiceRepository: SocialServiceRepository,
    @service(CommonPropertiesService)
    protected commonPropertiesService: CommonPropertiesService,
  ) { }

  async setSocialServiceGetResponse(school: string): Promise<object> {
    logMethodAccessDebug(this.setSocialServiceGetResponse.name);

    const socialServicesArray = await this.socialServiceRepository.find(
      {where: {school}}
    );
    const socialServiceTypes = socialServicesArray.filter(
      doc => doc.socialServiceType === true
    );
    logger.debug(`Socialservices types: ${JSON.stringify(socialServiceTypes)}`);

    const registeredInstitutionsObject = socialServicesArray.find(
      doc => doc.identifier === registeredInstitutionsLinkId
    );
    if (!registeredInstitutionsObject) throw noDocFoundError(
      SOCIAL_SERVICE_COLLECTION_NAME,
      {school, identifier: registeredInstitutionsLinkId}
    );
    const registrationCompanyFormatObject = socialServicesArray.find(
      doc => doc.identifier === registerCompanyFormatLinkId
    );
    if (!registrationCompanyFormatObject) throw noDocFoundError(
      SOCIAL_SERVICE_COLLECTION_NAME,
      {school, identifier: registerCompanyFormatLinkId}
    );
    const socialServiceRequirementsObject = socialServicesArray.find(
      doc => doc.identifier === socialServiceRequirementsLinkId
    );
    if (!socialServiceRequirementsObject) throw noDocFoundError(
      SOCIAL_SERVICE_COLLECTION_NAME,
      {school, identifier: socialServiceRequirementsLinkId}
    );

    logger.debug('Social Service documents links fetched');

    const socialServiceRequirements = socialServicesArray.find(
      doc => doc.identifier === SOCIAL_SERVICE_REQUIREMENTS
    );
    if (!socialServiceRequirements) throw noDocFoundError(
      SOCIAL_SERVICE_COLLECTION_NAME,
      {school, identifier: SOCIAL_SERVICE_REQUIREMENTS}
    );

    logger.debug('Social Service requirements steps fetched');

    const socialServiceData: object = {
      socialServiceTypes,
      filesLinks: {
        registeredInstitutions: registeredInstitutionsObject.link,
        registrationCompanyFormat: registrationCompanyFormatObject.link,
        socialServiceRequirements: socialServiceRequirementsObject.link
      },
      socialServiceRequirements: socialServiceRequirements!.steps
    }

    return socialServiceData;
  }

  async validateSocialServiceTypeId(school: string, acrom: string) {
    logMethodAccessTrace(this.validateSocialServiceTypeId.name);
    const filter = {school, acrom};
    const socialServiceDocument = await this.socialServiceRepository.find(
      {where: filter}
    );
    if (!socialServiceDocument) throw noDocFoundError(
      SOCIAL_SERVICE_COLLECTION_NAME,
      filter
    );
  }

  setSocialServiceServicioProperties(
    studentData: StudentData,
    socialServiceReqBody: SocialServiceRB
  ) {
    logMethodAccessDebug(this.setSocialServiceServicioProperties.name);
    const {school} = studentData;
    switch (school) {
      // case UTC:
      //   return this.setSocialServiceServicioPropertiesforUtc(
      //     studentData,
      //     socialServiceReqBody
      //   );
      case ULA:
        return this.setSocialServiceServicioPropertiesforUla(
          studentData,
          socialServiceReqBody
        );
      default:
        throw schoolError(school);
    }
  }

  private setSocialServiceServicioPropertiesforUtc(
    studentData: StudentData,
    socialServiceReqBody: SocialServiceRB
  ) {
    return {}
  }

  private setSocialServiceServicioPropertiesforUla(
    studentData: StudentData,
    requestBody: SocialServiceRB
  ) {
    logMethodAccessDebug(this.setSocialServiceServicioPropertiesforUla.name);
    const commonServicioObject: CommonServiceFields_ULA =
      this.commonPropertiesService.setCommonPropertiesUla(
        studentData,
        requestBody
      );
    if (requestBody.socialServiceTypeId === PROGRAMA_DE_ULA_ID) {
      if (!requestBody.institutionName)
        throw missingPropertyError('institutionName');
      if (!requestBody.programManager)
        throw missingPropertyError('programManager');
      if (!requestBody.programManagerPosition)
        throw missingPropertyError('programManagerPosition');
      const ulaProgramServiceObject: SocialServiceProgramaULAServicioFields_ULA = {
        ...commonServicioObject,
        Nombre_de_la_Institucion__c: requestBody.institutionName,
        Responsable_del_Programa__c: requestBody.programManager,
        Cargo_del_responsable__c: requestBody.programManagerPosition,
      }
      logger.debug(
        `Service properties setted: ${JSON.stringify(ulaProgramServiceObject)}`
      );
      return ulaProgramServiceObject;
    }
    logger.debug(
      `Service properties setted: ${JSON.stringify(commonServicioObject)}`
    );
    return commonServicioObject;
  }
}
