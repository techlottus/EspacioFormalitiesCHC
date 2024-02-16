import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  CommonPropertiesService,
  CostsService,
  ErrorsService,
} from '.';
import {
  DETAIL_CODES_COLLECTION_NAME,
  EJECUTIVA,
  ESCOLARIZADA,
  ONLINE,
  PROOF_OF_STUDY,
  PROOF_OF_STUDY_COLLECTION_NAME,
  ULA,
  UTC,
} from '../constants';
import {
  CommonServiceFields_UTEG,
  ProofOfStudyOnline_ULA,
  ProofOfStudyServiceFieldsUteg,
  ProofOfStudyTradicional_ULA,
  ProofofStudyServiceFields_UTC,
  StudentData,
} from '../interfaces';
import {ProcedureWithCost, ProofOfStudyRB} from '../models';
import {
  AcademicLevelsRepository,
  DetailCodesRepository,
  ModalProofOfStudyRepository,
  ProofOfStudyRepository,
} from '../repositories';
import {
  changeSchoolNameByModality,
  costsError,
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
  missingPropertyError,
  modalityError,
  noDocFoundError,
  schoolError,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class ProofOfStudyService {
  constructor(
    @repository(DetailCodesRepository)
    protected detailCodesRepository: DetailCodesRepository,
    @repository(ProofOfStudyRepository)
    protected proofOfStudyRepository: ProofOfStudyRepository,
    @repository(ModalProofOfStudyRepository)
    protected modalProofOfStudyRepository: ModalProofOfStudyRepository,
    @repository(AcademicLevelsRepository)
    protected academicLevelsRepository: AcademicLevelsRepository,
    @service(CommonPropertiesService)
    public commonPropertiesService: CommonPropertiesService,
    @service(CostsService)
    protected costsService: CostsService,
    @service(ErrorsService)
    public errorsService: ErrorsService,
  ) { }

  async getProofOfStudyWithCostsArray(
    school: string,
    academicLevel: string,
    modality: string,
    authHeader: string,
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessTrace(this.getProofOfStudyWithCostsArray.name);
    switch (school) {
      case UTC:
        return this.getProofOfStudyWithCostsArrayForUtc(
          academicLevel,
          school,
          authHeader,
        );
      case ULA:
        return this.getProofOfStudyWithCostsArrayForUla(
          school,
          modality,
          authHeader,
          academicLevel,
        );
      default:
        throw schoolError(school);
    }
  }
  private async getProofOfStudyWithCostsArrayForUtc(
    academicLevel: string,
    school: string,
    authHeader: string,
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessDebug(this.getProofOfStudyWithCostsArray.name);
    // FETCH PROOFOFSTUDIES AND DETAIL CODES COLLECTIONS
    const procedure = PROOF_OF_STUDY;
    logger.debug(
      `Fetching detailCodes for school: ${school} and procedure: ${procedure}`,
    );
    //verify levelcode for change name of school by UANE only levels 1T, BO, !P
    const changedSchool = await changeSchoolNameByModality(
      academicLevel,
      school,
      this.academicLevelsRepository,
    );
    let detailIdProofOfStudyArray = await this.detailCodesRepository.find({
      where: {school: changedSchool, procedure},
    });
    logger.debug(
      `DetailCode documents fetched: ` +
      `${JSON.stringify(detailIdProofOfStudyArray)}`,
    );
    const proofOfStudyDocsArray = await this.proofOfStudyRepository.find({
      where: {school},
    });
    logger.debug(
      `ProofOfStudy array: ${JSON.stringify(proofOfStudyDocsArray)}`,
    );

    // FETCH COSTS OF EVERY PROOF OF STUDY
    const detailIdArray: string[] = [];
    detailIdProofOfStudyArray.forEach(dcPoS => {
      const documentLevels = dcPoS.levels!;
      if (documentLevels.includes(academicLevel)) {
        detailIdArray.push(dcPoS.detailCode);
      }
    });
    if (!detailIdArray)
      throw this.errorsService.setErrorResponse(
        'There was a problem fetching proofOfStudy costs',
        `DetailId documents doesn't include academicLevel '${academicLevel}'`,
        404,
      );
    logger.debug(`detailId array: ${detailIdArray}`);
    detailIdProofOfStudyArray = detailIdProofOfStudyArray.filter(doc =>
      doc.levels!.includes(academicLevel),
    );
    logger.debug(
      `detailId documents filtered by level: ` +
      `${JSON.stringify(detailIdProofOfStudyArray)}`,
    );
    const costsArray = await this.costsService.getCosts(
      authHeader,
      detailIdArray,
    );

    // BUILD ARRAY WITH PROOF OF STUDY WITH COSTS
    const posWithCostsArray: ProcedureWithCost[] = [];
    proofOfStudyDocsArray.forEach(proofOfStudy => {
      const {label, value} = proofOfStudy;
      const dcPoSObj = detailIdProofOfStudyArray.find(doc =>
        doc.identifiers!.includes(value),
      );
      if (!dcPoSObj) {
        const notFoundMessage =
          `No document found in ` +
          `${DETAIL_CODES_COLLECTION_NAME} collection with identifier '${value}'`;
        logger.fatal(notFoundMessage);
        throw new HttpErrors.NotFound(notFoundMessage);
      }
      const {detailCode} = dcPoSObj;
      const detailIdCostObj = costsArray.find(
        obj => obj.codeDetail === detailCode,
      );
      let cost: number | null = detailIdCostObj!.cost;
      if (cost === -1) {
        logger.warn(`Cost didn't fetched: ${JSON.stringify(detailIdCostObj)}`);
        cost = null;
      }
      const posWithCost = new ProcedureWithCost({
        label,
        value,
        detailId: detailCode,
        cost,
      });
      posWithCostsArray.push(posWithCost);
    });
    logger.debug(
      `ProofOfStudy array with costs: ${JSON.stringify(posWithCostsArray)}`,
    );
    return posWithCostsArray;
  }

  private async getProofOfStudyWithCostsArrayForUla(
    school: string,
    modality: string,
    authHeader: string,
    academicLevel: string,
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessDebug(this.getProofOfStudyWithCostsArrayForUla.name);
    //verify levelcode for change name school to 'UTCBYUANE' or 'ULABYUANE' only levels 1T, BO, !P
    const changedSchool = await changeSchoolNameByModality(
      academicLevel,
      school,
      this.academicLevelsRepository,
    );
    // FETCH PROOFOFSTUDIES AND DETAIL CODES COLLECTIONS
    const procedure = PROOF_OF_STUDY;
    const filter = {
      school: changedSchool,
      procedure,
      modality,
    };
    logger.debug(`Fetching detailCode for ${JSON.stringify(filter)} `);
    let detailIdPoSDocument = await this.detailCodesRepository.findOne({
      where: filter,
    });
    if (!detailIdPoSDocument)
      throw noDocFoundError(DETAIL_CODES_COLLECTION_NAME, filter);
    const detailId = detailIdPoSDocument.detailCode;
    logger.debug(`DetailCode fetched: ${detailId} `);
    const proofOfStudyDocsArray = await this.proofOfStudyRepository.find({
      where: {school, modality},
    });
    logger.debug(`ProofOfStudy: ${JSON.stringify(proofOfStudyDocsArray)}`);

    // FETCH COSTS OF EVERY PROOF OF STUDY
    const detailIdArray = [detailId];
    const costsArray = await this.costsService.getCosts(
      authHeader,
      detailIdArray,
    );

    // BUILD ARRAY WITH PROOF OF STUDY WITH COSTS
    const posWithCostsArray: ProcedureWithCost[] = [];
    proofOfStudyDocsArray.forEach(proofOfStudy => {
      const {label, value} = proofOfStudy;
      const detailIdCostObj = costsArray.find(
        obj => obj.codeDetail === detailId,
      );
      if (!detailIdCostObj) throw costsError(detailId);
      let cost: number | null = detailIdCostObj.cost;
      if (cost === -1) {
        logger.warn(`Cost didn't fetched: ${JSON.stringify(detailIdCostObj)}`);
        cost = null;
      }
      const posWithCost = new ProcedureWithCost({
        label,
        value,
        detailId,
        cost,
      });
      posWithCostsArray.push(posWithCost);
    });
    logger.debug(
      `ProofOfStudy array with costs: ${JSON.stringify(posWithCostsArray)} `,
    );
    return posWithCostsArray;
  }

  async fetchModalData(school: string, modality: string) {
    logMethodAccessDebug(this.fetchModalData.name);
    // set filter to fetch modal data
    let modalFilter: object = {school};
    if (school === ULA) {
      modalFilter = {school, modality};
    }
    logger.debug(`modalFilter: '${JSON.stringify(modalFilter)}'`);
    const modalData = await this.modalProofOfStudyRepository.find({
      where: modalFilter,
    });
    return modalData;
  }

  //////////////////////// POST methods ////////////////

  // SETS 'SERVICIO' PROPERTIES FOR PROOF OF STUDY
  async setProofOfStudyServiceProperties(
    studentData: StudentData,
    requestBody: ProofOfStudyRB,
  ) {
    logMethodAccessTrace(this.setProofOfStudyServiceProperties.name);
    const {school, modality} = studentData;
    logger.debug(`School: ${school}, modality: ${modality}`);
    switch (school) {
      case UTC:
        return this.setProofOfStudyServicePropertiesUTC(
          studentData,
          requestBody,
        );
      case ULA:
        const proofOfStudyPropiertiesUla =
          await this.setProofOfStudyServicePropertiesULA(
            studentData,
            requestBody,
          );
        logger.debug(
          `ProofOfStudy servicio properties setted: ` +
          `${JSON.stringify(proofOfStudyPropiertiesUla)}`,
        );
        return proofOfStudyPropiertiesUla;
      default:
        throw schoolError(school);
    }
  }

  private async setProofOfStudyServicePropertiesUTC(
    studentData: StudentData,
    requestBody: ProofOfStudyRB,
  ): Promise<ProofofStudyServiceFields_UTC> {
    logMethodAccessInfo(this.setProofOfStudyServicePropertiesUTC.name);
    const utcCommonServiceFields = await this.commonPropertiesService.
      setCommonPropertiesUtcWithDeliveryAndCampus(
        studentData,
        requestBody,
      );
    if (requestBody.sendToSedena === undefined)
      throw missingPropertyError('sendToSedena');
    const posServiceFields: ProofofStudyServiceFields_UTC = {
      ...utcCommonServiceFields,
      Tipo_de_Constancia_UTC__c: await this.setProofOfStudyLabel(
        studentData.school,
        requestBody.proofOfStudyType,
      ),
      Dirigir_a_SEDENA__c: requestBody.sendToSedena,
    };
    logger.debug(
      `ProofOfStudy service properties setted: ` +
      `${JSON.stringify(posServiceFields)}`,
    );
    return posServiceFields;
  }

  private async setProofOfStudyServicePropertiesULA(
    studentData: StudentData,
    requestBody: ProofOfStudyRB,
  ) {
    logMethodAccessInfo(this.setProofOfStudyServicePropertiesULA.name);
    const {school, modality} = studentData;
    const commonServiceFields = await this.commonPropertiesService.
      setCommonPropertiesUlaWithDeliveryAndCampus(
        studentData,
        requestBody,
      );
    switch (modality) {
      case ONLINE:
      case EJECUTIVA:
        const posOnlineServiceFields: ProofOfStudyOnline_ULA = {
          ...commonServiceFields,
          Tipo_de_Constancia__c: await this.setProofOfStudyLabel(
            school,
            requestBody.proofOfStudyType,
            modality,
          ),
        };
        return posOnlineServiceFields;
      case ESCOLARIZADA:
        if (requestBody.sendToSedena === undefined)
          throw missingPropertyError('sendToSedena');
        const posTraditionalServiceFields: ProofOfStudyTradicional_ULA = {
          ...commonServiceFields,
          Tipo_de_Constancia_TRADICIONAL__c: await this.setProofOfStudyLabel(
            school,
            requestBody.proofOfStudyType,
            modality,
          ),
          Dirigir_a_SEDENA__c: requestBody.sendToSedena,
        };
        return posTraditionalServiceFields;
      default:
        throw modalityError(modality);
    }
  }

  async setProofOfStudyServicePropertiesUteg(
    studentData: StudentData,
    requestBody: ProofOfStudyRB,
  ) {
    logMethodAccessInfo(this.setProofOfStudyServicePropertiesUteg.name);
    const commonServiceFields: CommonServiceFields_UTEG =
      this.commonPropertiesService.setCommonPropertiesUteg(
        studentData,
        requestBody
      );
    const posServiceFields: ProofOfStudyServiceFieldsUteg = {
      ...commonServiceFields,
      Constancia_UTEG__c: await this.setProofOfStudyLabel(
        studentData.school,
        requestBody.proofOfStudyType
      )
    }
    return posServiceFields;
  }

  // SETS PROOF OF STUDY LABEL
  private async setProofOfStudyLabel(
    school: string,
    value: string,
    modality?: string,
  ): Promise<string> {
    logMethodAccessDebug(this.setProofOfStudyLabel.name);
    let posFilter: object = {
      school,
      value,
    };
    if (modality === EJECUTIVA) modality = ONLINE;
    if (modality) {
      posFilter = {
        ...posFilter,
        modality,
      };
    }
    const proofOfStudyDocument = await this.proofOfStudyRepository.findOne({
      where: posFilter,
    });
    if (!proofOfStudyDocument)
      throw noDocFoundError(PROOF_OF_STUDY_COLLECTION_NAME, posFilter);
    const {label} = proofOfStudyDocument;
    logger.debug(`ProofOfStudy found.Value: ${value}, Label: ${label} `);
    return label;
  }
}
