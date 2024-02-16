import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CommonPropertiesService} from '.';
import {
  ESCOLARIZADA,
  SCHOLARSHIP,
  SCHOLARSHIP_COLLECTION_NAME,
  ULA,
  UTC,
} from '../constants';
import {Scholarship_ULA, StudentData} from '../interfaces';
import {ScholarshipRB} from '../models';
import {ScholarshipRepository} from '../repositories';
import {
  logMethodAccessDebug,
  logMethodAccessTrace,
  logger,
  missingPropertyError,
  noDocFoundError,
  schoolError,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class ScholarshipService {
  constructor(
    @service(CommonPropertiesService)
    public commonPropertiesService: CommonPropertiesService,
    @repository(ScholarshipRepository)
    protected scholarshipRepository: ScholarshipRepository,
  ) { }

  async fetchScholarshipData(school: string, modality: string) {
    logMethodAccessDebug(this.fetchScholarshipData.name);
    const filter = {school, modality};
    const scholarshipData = await this.scholarshipRepository.find({
      where: filter,
    });
    if (!scholarshipData.length)
      throw noDocFoundError(SCHOLARSHIP_COLLECTION_NAME, filter);
    return scholarshipData;
  }

  async setScholarshipServiceProperties(
    studentData: StudentData,
    requestBody: ScholarshipRB,
  ) {
    logMethodAccessTrace(this.setScholarshipServiceProperties.name);
    const {school, modality} = studentData;
    switch (school) {
      case ULA:
        return this.setScholarshipPropertiesUla(
          studentData,
          requestBody,
          modality,
        );
      case UTC:
        return this.commonPropertiesService.setCommonPropertiesUtc(
          studentData,
          requestBody,
          SCHOLARSHIP
        );
      default:
        throw schoolError(school);
    }
  }

  private async setScholarshipPropertiesUla(
    studentData: StudentData,
    requestBody: ScholarshipRB,
    modality: string,
  ) {
    logMethodAccessDebug(this.setScholarshipPropertiesUla.name);
    const commonProperties =
      this.commonPropertiesService.setCommonPropertiesUla(
        studentData,
        requestBody,
      );
    let scholarshipProperties: Scholarship_ULA;
    if (modality == ESCOLARIZADA) {
      if (!requestBody.scholarshipTypeValue)
        throw missingPropertyError('scholarshipTypeValue');
      scholarshipProperties = {
        ...commonProperties,
        Tipo_de_Solicitud_de_Beca_TRAD__c: await this.setScholarshipLabel(
          requestBody.scholarshipTypeValue,
        ),
      };
    } else {
      scholarshipProperties = commonProperties;
    }
    logger.debug(
      `Scholarship properties setted: ${JSON.stringify(scholarshipProperties)}`
    );
    return scholarshipProperties;
  }

  // SETS SCHOLARSHIP FOR THE SELECT FIELD
  private async setScholarshipLabel(scholarshipTypeValue: string): Promise<string> {
    logMethodAccessTrace(this.setScholarshipLabel.name);
    const filter = {value: scholarshipTypeValue};
    const scholarshipDocument = await this.scholarshipRepository.findOne({
      where: filter,
    });
    if (!scholarshipDocument)
      throw noDocFoundError(SCHOLARSHIP_COLLECTION_NAME, filter);
    const {label} = scholarshipDocument;
    logger.debug(
      `Scholarship found. Value: ${scholarshipTypeValue}, Label: ${label}`,
    );
    return label;
  }
}
