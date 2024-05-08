import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CostsService, ErrorsService} from '.';
import {
  BA,
  CERT_REQUEST,
  CERT_REQUIREMENTS,
  DETAIL_CODES_COLLECTION_NAME,
  EJECUTIVA,
  ESCOLARIZADA,
  MASTER_LEVELS,
  ONLINE,
  PARTIAL,
  PREPA_UNAM,
  SEEM,
  STUDY_CERTIFICATE,
  STUDY_CERTIFICATE_COLLECTION_NAME,
  TIPO_DE_CERTIFICADO_TOTAL,
  TOTAL,
  ULA,
  UTC,
  UTEG,
} from '../constants';
import {StudentData} from '../interfaces';
import {
  CertificateFlags,
  CertificateRequirements,
  DetailCodes,
  ProcedureWithCost,
} from '../models';
import {
  AcademicLevelsRepository,
  DetailCodesRepository,
  StudyCertificateRepository,
} from '../repositories';
import {
  costsError,
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
  modalityError,
  noDocFoundError,
  schoolError,
  undefinedFieldInDoc,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class StudyCertificateGetService {
  constructor(
    @repository(AcademicLevelsRepository)
    protected academicLevelsRepository: AcademicLevelsRepository,
    @repository(DetailCodesRepository)
    protected detailCodesRepository: DetailCodesRepository,
    @repository(StudyCertificateRepository)
    protected studyCertificateRepository: StudyCertificateRepository,
    @service(CostsService)
    protected costsService: CostsService,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) { }

  async setRequirementsArray(levelCode: string) {
    logMethodAccessInfo(this.setRequirementsArray.name);
    const requirementsArray = await this.fetchCertRequirementsArray();
    let requirements: CertificateRequirements[] = [];
    const generalReq = [PARTIAL, TOTAL];
    requirementsArray.forEach(doc => {
      if (generalReq.includes(doc.id)) requirements.push(doc);
    });
    if (levelCode === "03") {
      requirements.push(
        await this.fetchRequirementById(SEEM, requirementsArray)
      );
      logger.info(`Levelcode: 03, SEEM requirements added`);
    }
    if (levelCode === '01') {
      requirements.push(
        await this.fetchRequirementById(PREPA_UNAM, requirementsArray)
      );
      logger.info(`Levelcode: 01, PrepaUNAM requirements added`);
    }
    logger.debug(`Requirements array setted`);
    logger.trace(`Requirements array: ${JSON.stringify(requirements)}`);
    return requirements;
  }

  async fetchCertRequirementsArray(): Promise<CertificateRequirements[]> {
    logMethodAccessTrace(this.fetchCertRequirementsArray.name);
    const reqFilter = {identifier: CERT_REQUIREMENTS};
    const certRequirements = await this.studyCertificateRepository.findOne({
      where: reqFilter
    });
    if (!certRequirements)
      throw noDocFoundError(STUDY_CERTIFICATE_COLLECTION_NAME, reqFilter);
    const requirementsArray = certRequirements.requirements;
    if (!requirementsArray) {
      throw undefinedFieldInDoc(
        'requirements',
        reqFilter,
        STUDY_CERTIFICATE_COLLECTION_NAME
      );
    }
    logger.trace(`requirementsArray: ${JSON.stringify(requirementsArray)}`);
    return requirementsArray;
  }

  async fetchRequirementById(
    id: string,
    requirementsArray?: CertificateRequirements[],
  ): Promise<CertificateRequirements> {
    logMethodAccessTrace(this.fetchRequirementById.name);
    if (!requirementsArray)
      requirementsArray = await this.fetchCertRequirementsArray()
    const requirementsDoc = requirementsArray.find(doc => doc.id === id);
    if (!requirementsDoc)
      throw noDocFoundError(
        STUDY_CERTIFICATE_COLLECTION_NAME,
        {
          identifier: CERT_REQUIREMENTS,
          requirements: {
            id
          }
        }
      );
    return requirementsDoc;
  }

  async setStudyCertFlags(studentData: StudentData) {
    logMethodAccessInfo(this.setStudyCertFlags.name);
    const flags = new CertificateFlags();
    const {school, levelCode} = studentData;
    if (school !== ULA) return flags;
    const certReqFilter = {
      school,
      identifier: CERT_REQUEST,
    };
    const certRequest = await this.studyCertificateRepository.findOne(
      {where: certReqFilter},
    );
    if (!certRequest)
      throw noDocFoundError(STUDY_CERTIFICATE_COLLECTION_NAME, certReqFilter);
    logger.trace('certificate request document: ' + JSON.stringify(certRequest));
    if (!certRequest.certificateRequest)
      throw undefinedFieldInDoc(
        'certificateRequest',
        certReqFilter,
        STUDY_CERTIFICATE_COLLECTION_NAME
      );
    flags.certificateRequest.display = true;
    flags.certificateRequest.link = certRequest.certificateRequest;
    flags.files.certificateRequest = true;
    flags.files.ine = true;
    flags.files.curp = true;
    flags.files.academicRecord = true;
    const masterFilter = {
      identifier: MASTER_LEVELS,
      school
    }
    const masterLevelsDoc = await this.academicLevelsRepository.findOne({
      where: masterFilter
    })
    const masterLevels = masterLevelsDoc?.levels;
    if (masterLevels?.includes(levelCode)) {
      flags.files.identityCard = true;
      flags.files.bachelorsDegree = true;
    }
    logger.info('Flags setted: ' + JSON.stringify(flags));
    return flags;
  }

  async setCertificateWithCostArray(
    studentData: StudentData,
    authHeader: string,
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessInfo(this.setCertificateWithCostArray.name);
    const {school, modality} = studentData;
    //verify levelcode for change name of school by UANE only levels 1T, BO, !P
    const changedSchool =
    await this.academicLevelsRepository.changeSchoolNameByModality(
      studentData.levelCode,
      school,
    );
    // Fetch detail codes
    let dcStudyCertArray: DetailCodes[];
    const dcFilter = {
      school: changedSchool,
      procedure: STUDY_CERTIFICATE,
    };
    dcStudyCertArray = await this.detailCodesRepository.find({where: dcFilter});
    logger.trace(`Study cert array: ${JSON.stringify(dcStudyCertArray)}`);
    if (!dcStudyCertArray.length)
      throw noDocFoundError(DETAIL_CODES_COLLECTION_NAME, dcFilter);
    switch (school) {
      case UTC:
        return this.setCertificateWithCostsArrayUtc(
          studentData,
          authHeader,
          dcStudyCertArray,
        );
      case ULA:
        return this.setCertificateWithCostArrayUla(
          authHeader,
          dcStudyCertArray,
          modality
        );
      case UTEG:
        return this.matchDetailIdWithCostsAndStudyCertificates(
          authHeader,
          dcStudyCertArray,
          UTEG
        );
      default:
        throw schoolError(school);
    }
  }

  private async setCertificateWithCostsArrayUtc(
    studentData: StudentData,
    authHeader: string,
    dcStudyCertArray: DetailCodes[],
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessTrace(this.setCertificateWithCostsArrayUtc.name);
    const {levelCode} = studentData;
    dcStudyCertArray = dcStudyCertArray.filter(doc =>
      doc.levels!.includes(levelCode),
    );
    if (!dcStudyCertArray.length)
      throw this.errorsService.setErrorResponse(
        "It was not possible to set Study Certificate array with costs",
        `No detail code found in ${DETAIL_CODES_COLLECTION_NAME} with ` +
        `level code '${levelCode}'`,
        404
      );
    let {campus} = studentData;
    campus = campus.toUpperCase();
    campus = campus.replace('PLANTEL', '');
    campus = campus.replace(' ', '');
    logger.debug(`Campus: ${campus}`);

    const detailIdArray: string[] = [];
    const studyCertCostsArray: ProcedureWithCost[] = [];

    // FETCH COSTS ARRAY OF PAYMENTS SERVICE
    dcStudyCertArray.forEach(dcStudyCert => {
      if (levelCode === BA) {
        if (dcStudyCert.campus!.includes(campus)) {
          detailIdArray.push(dcStudyCert.detailCode);
        }
      } else {
        detailIdArray.push(dcStudyCert.detailCode);
      }
    });
    logger.debug(`detailIdArray: ${detailIdArray}`);
    dcStudyCertArray = dcStudyCertArray.filter(doc =>
      detailIdArray.includes(doc.detailCode),
    );
    logger.debug(
      `detailCodesStudyCertArray: ${JSON.stringify(dcStudyCertArray)}`,
    );
    const costsArray = await this.costsService.getCosts(
      authHeader,
      detailIdArray,
    );

    const studyCertificateArray = await this.fetchStudyCertificateArray(UTC);
    // Create array of StudyCertificates with costs
    studyCertificateArray.forEach(studyCert => {
      const {label, value} = studyCert;
      const dcStudyCertObj = dcStudyCertArray.find(
        doc => doc.identifier === value,
      );
      if (!dcStudyCertObj)
        throw noDocFoundError(DETAIL_CODES_COLLECTION_NAME, {
          identifier: value,
        });
      const detailId = dcStudyCertObj.detailCode;
      const detailIdCostObj = costsArray.find(
        obj => obj.codeDetail === detailId,
      );
      let cost: number | null = detailIdCostObj!.cost;
      if (cost === -1) cost = null;
      const studyCertCost = new ProcedureWithCost({
        label,
        value,
        detailId,
        cost,
      });
      studyCertCostsArray.push(studyCertCost);
    });
    logger.debug(
      `Study certificate array with costs: ` +
      `${JSON.stringify(studyCertCostsArray)}`,
    );
    return studyCertCostsArray;
  }

  private async setCertificateWithCostArrayUla(
    authHeader: string,
    dcStudyCertArray: DetailCodes[],
    modality: string,
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessTrace(this.setCertificateWithCostArrayUla.name);

    if (modality === EJECUTIVA) modality = ONLINE;
    switch (modality) {
      case ONLINE:
        return this.setCertificateWithCostArrayUlaOnline(
          authHeader,
          dcStudyCertArray,
        );
      case ESCOLARIZADA:
        return this.setCertificateWithCostArrayUlaTraditional(
          authHeader,
          dcStudyCertArray,
        );
      default:
        throw modalityError(modality);
    }
  }

  private async setCertificateWithCostArrayUlaOnline(
    authHeader: string,
    dcStudyCertArray: DetailCodes[],
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessDebug(this.setCertificateWithCostArrayUlaOnline.name);
    const studyCertificateArray = await this.fetchStudyCertificateArray(ULA);
    const detailIdDocument = dcStudyCertArray.find(
      doc => doc.modality === ONLINE,
    );
    if (!detailIdDocument)
      throw noDocFoundError(STUDY_CERTIFICATE_COLLECTION_NAME, {
        school: ULA,
        modality: ONLINE,
      });
    const detailId = detailIdDocument.detailCode;
    const detailIdArray = [detailId];
    logger.debug(`detailIdArray: ${detailIdArray}`);
    const costsArray = await this.costsService.getCosts(
      authHeader,
      detailIdArray,
    );
    const studyCertCostsArray: ProcedureWithCost[] = [];
    // Create array of StudyCertificates with costs
    studyCertificateArray.forEach(studyCert => {
      const {label, value} = studyCert;
      const detailIdCostObj = costsArray.find(
        obj => obj.codeDetail === detailId,
      );
      if (!detailIdCostObj) throw costsError(detailId);
      let cost: number | null = detailIdCostObj.cost;
      if (cost === -1) cost = null;
      const studyCertCost = new ProcedureWithCost({
        label,
        value,
        detailId,
        cost,
      });
      studyCertCostsArray.push(studyCertCost);
    });
    logger.debug(
      `Study certificate array with costs: ` +
      `${JSON.stringify(studyCertCostsArray)}`,
    );
    return studyCertCostsArray;
  }

  private async setCertificateWithCostArrayUlaTraditional(
    authHeader: string,
    dcStudyCertArray: DetailCodes[],
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessDebug(
      this.setCertificateWithCostArrayUlaTraditional.name,
    );
    // const studyCertificateArray = await this.fetchStudyCertificateArray(ULA);
    dcStudyCertArray = dcStudyCertArray.filter(doc =>
      doc.modality!.includes(ESCOLARIZADA),
    );
    logger.debug(
      `detailCodesStudyCertArray: ${JSON.stringify(dcStudyCertArray)}`,
    );
    return this.matchDetailIdWithCostsAndStudyCertificates(
      authHeader,
      dcStudyCertArray,
      ULA
    );
  }

  private async matchDetailIdWithCostsAndStudyCertificates(
    authHeader: string,
    dcStudyCertArray: DetailCodes[],
    school: string
  ): Promise<ProcedureWithCost[]> {
    logMethodAccessTrace(this.matchDetailIdWithCostsAndStudyCertificates.name);
    const detailIdArray: string[] = [];
    const studyCertCostsArray: ProcedureWithCost[] = [];

    // FETCH COSTS ARRAY OF PAYMENTS SERVICE
    dcStudyCertArray.forEach(dcStudyCert => {
      detailIdArray.push(dcStudyCert.detailCode);
    });
    logger.debug(`detailIdArray: ${detailIdArray}`);
    const costsArray = await this.costsService.getCosts(
      authHeader,
      detailIdArray,
    );
    const studyCertificateArray = await this.fetchStudyCertificateArray(school);
    // Create array of StudyCertificates with costs
    studyCertificateArray.forEach(studyCert => {
      const {label, value} = studyCert;
      // get detailId
      const dcStudyCertObj = dcStudyCertArray.find(
        doc => doc.identifier === value,
      );
      if (!dcStudyCertObj)
        throw noDocFoundError(DETAIL_CODES_COLLECTION_NAME, {
          identifier: value,
        });
      const detailId = dcStudyCertObj.detailCode;
      // get cost
      const detailIdCostObj = costsArray.find(
        obj => obj.codeDetail === detailId,
      );
      if (!detailIdCostObj) throw costsError(detailId);
      let cost: number | null = detailIdCostObj.cost;
      if (cost === -1) cost = null;
      const studyCertCost = new ProcedureWithCost({
        label,
        value,
        detailId,
        cost,
      });
      studyCertCostsArray.push(studyCertCost);
    });
    logger.debug(
      `Study certificate array with costs: ` +
      `${JSON.stringify(studyCertCostsArray)}`,
    );
    return studyCertCostsArray;
  }

  private async fetchStudyCertificateArray(school: string) {
    logMethodAccessTrace(this.fetchStudyCertificateArray.name);
    const studyCertFilter = {school, identifier: STUDY_CERTIFICATE};
    logger.debug(
      `Fetching study certificates from '${STUDY_CERTIFICATE_COLLECTION_NAME}'`,
    );
    const studyCertificateArray = await this.studyCertificateRepository.find({
      where: studyCertFilter,
    });
    if (!studyCertificateArray.length)
      throw noDocFoundError(STUDY_CERTIFICATE_COLLECTION_NAME, studyCertFilter);
    logger.debug(
      `StudyCertificateArray: ${JSON.stringify(studyCertificateArray)}`,
    );
    return studyCertificateArray;
  }

  async fetchTotalStudyCertificateArray(school: string) {
    logMethodAccessInfo(this.fetchTotalStudyCertificateArray.name);
    const totalCertFilter = {
      school,
      identifier: TIPO_DE_CERTIFICADO_TOTAL,
    }
    const totalCertificateArray = await this.studyCertificateRepository.find({
      where: totalCertFilter
    });
    if (!totalCertificateArray.length)
      throw noDocFoundError(STUDY_CERTIFICATE_COLLECTION_NAME, totalCertFilter);
    logger.debug(
      `TotalCertificateArray: ${JSON.stringify(totalCertificateArray)}`,
    );
    return totalCertificateArray;
  }
}
