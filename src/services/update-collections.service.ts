///////////////////// UpdateCollectionsService /////////////////
// Functions to check and performe picklist salesforce collections
////////////////////////////////////////////////////////////////

import {BindingScope, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {
  CampusService,
  ErrorsService,
  KeysService,
  PicklistInterface,
  SfCoreService,
  SfPicklist,
} from '.';
import {
  CAMPUS_COLLECTION_NAME,
  DOCUMENT_COPY_COLLECTION_NAME,
  ONLINE,
  PROOF_OF_STUDY_COLLECTION_NAME,
  SCHOLARSHIP_COLLECTION_NAME,
  SF_PICKLIST_ULA_URL,
  SF_PICKLIST_UTC_URL,
  STUDY_CERTIFICATE_COLLECTION_NAME,
  TIPO_DE_CERTIFICADO_TOTAL,
  TIPO_DE_CONSTANCIA,
  TIPO_DE_SOLICITUD_BECA,
  ULA,
  UTC
} from '../constants';
import {Campus, ProofOfStudy, Scholarship, StudyCertificate} from '../models';
import {
  CampusRepository,
  PhotostaticCopyOfDocumentRepository,
  ProofOfStudyRepository,
  ScholarshipRepository,
  StudyCertificateRepository,
} from '../repositories';
import {
  createIdWithPrefix,
  dateString,
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logNoDocFound,
  logger,
  parseDate,
  undefinedFieldInDoc,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class UpdateCollectionsService {
  constructor(
    @inject('services.SfPicklist')
    protected sfPicklist: SfPicklist,
    @repository(ProofOfStudyRepository)
    protected proofOfStudyRepository: ProofOfStudyRepository,
    @repository(StudyCertificateRepository)
    protected studyCertificateRepository: StudyCertificateRepository,
    @repository(CampusRepository)
    protected campusRepository: CampusRepository,
    @repository(ScholarshipRepository)
    protected scholarshipRepository: ScholarshipRepository,
    @repository(PhotostaticCopyOfDocumentRepository)
    protected photostaticCopyOfDocumentRepository: PhotostaticCopyOfDocumentRepository,
    @service(KeysService)
    protected keysService: KeysService,
    @service(SfCoreService)
    protected sfCoreService: SfCoreService,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
    @service(CampusService)
    protected campusService: CampusService,
  ) { }

  // UPDATES PROOF OF STUDY COMBO IF NEEDED
  async checkUpdateProofOfStudy(
    authHeader: string,
    modality: string,
    school: string,
  ) {
    logMethodAccessInfo(this.checkUpdateProofOfStudy.name);
    if (await this.dateChangedOfProofOfStudy(school, modality)) {
      const sfAuthHeader = await this.sfCoreService.getSfAccessToken(school);
      await this.updateProofOfStudyTypes(school, sfAuthHeader, modality);
      await this.checkUpdateCampus(school, authHeader);
    } else {
      logger.debug(
        `${PROOF_OF_STUDY_COLLECTION_NAME} and ${CAMPUS_COLLECTION_NAME} ` +
        `collections didn't need to be updated`,
      );
    }
  }

  // UPDATES STUDY CERTIFICATE COMBO IF NEEDED
  async checkUpdateStudyCertificate(
    authHeader: string,
    modality: string,
    school: string,
  ) {
    logMethodAccessInfo(this.checkUpdateStudyCertificate.name);
    if (await this.dateChangedOfStudyCertificate(school, modality)) {
      const sfAuthHeader = await this.sfCoreService.getSfAccessToken(school);
      await this.updateTotalStudyCertificateTypes(school, sfAuthHeader);
      await this.checkUpdateCampus(school, authHeader);
    } else {
      logger.debug(
        `${STUDY_CERTIFICATE_COLLECTION_NAME} and ${CAMPUS_COLLECTION_NAME} ` +
        `collections didn't need to be updated`,
      );
    }
  }

  // UPDATES CAMPUS IF NEEDED
  async checkUpdateCampus(school: string, authHeader: string) {
    logMethodAccessInfo(this.checkUpdateCampus.name);
    if (await this.dateChangedOfCampus(school)) {
      await this.updateCampusBlended(school, authHeader);
    } else {
      logger.debug(
        `${CAMPUS_COLLECTION_NAME} collection didn't need to be updated`,
      );
    }
  }

  // UPDATES PHOTOSTATICCOPYOFDOCUMENT IF NEEDED
  // async checkUpdatePhotostaticCopyOfDocument(school: string, modality: string) {
  //   logMethodAccessInfo(this.checkUpdatePhotostaticCopyOfDocument.name);
  //   if (await this.dateChangedOfPhotostaticCopyOfDocument(school)) {
  //     const sfAuthHeader = await this.sfCoreService.getSfAccessToken(school);
  //     await this.updatePhotostaticCopyOfDocumentTypes(
  //       school,
  //       sfAuthHeader,
  //       modality,
  //     );
  //   } else {
  //     logger.debug(
  //       `${DOCUMENT_COPY_COLLECTION_NAME} collection didn't need to be updated`,
  //     );
  //   }
  // }

  // UPDATES SCHOLARSHIP IF NEEDED
  async checkUpdateScholarship(school: string, modality: string) {
    logMethodAccessInfo(this.checkUpdateScholarship.name);
    if (await this.dateChangedOfScholarship(school)) {
      const sfAuthHeader = await this.sfCoreService.getSfAccessToken(school);
      await this.updateScholarshipTypes(school, sfAuthHeader, modality);
    } else {
      logger.debug(
        `${SCHOLARSHIP_COLLECTION_NAME} collection didn't need to be updated`,
      );
    }
  }

  // // UPDATES PHOSTATICCOPYOFDOCUMENT COLLECTION
  // private async updatePhotostaticCopyOfDocumentTypes(
  //   school: string,
  //   sfAuthHeader: string,
  //   modality: string,
  // ) {
  //   logMethodAccessInfo(this.updatePhotostaticCopyOfDocumentTypes.name);
  //   const picklistName = await this.keysService.fetchKey(
  //     TIPO_DE_DOCUMENTO_DE_COPIA_FOTOSTATICA,
  //     school,
  //   );
  //   const photoStaticCopyOfDocumentArray = await this.fetchPicklist(
  //     school,
  //     picklistName,
  //     sfAuthHeader,
  //   );
  //   const filter = {school, modality};
  //   await this.photostaticCopyOfDocumentRepository.deleteAll(filter);
  //   logger.debug(
  //     `PhotostaticCopyOfDocument ${JSON.stringify(
  //       filter,
  //     )} deleted from ${DOCUMENT_COPY_COLLECTION_NAME}`,
  //   );

  //   for (const photoStaticCopyOfDocument of photoStaticCopyOfDocumentArray!) {
  //     const photoStaticCopyOfDocumentObject = new DocumentCopy({
  //       label: photoStaticCopyOfDocument.Label,
  //       value: createIdWithPrefix(
  //         'photoStaticCopyOfDocument',
  //         photoStaticCopyOfDocument.Value,
  //       ),
  //       date: dateString(),
  //       school,
  //       modality,
  //     });
  //     await this.photostaticCopyOfDocumentRepository.create(
  //       photoStaticCopyOfDocumentObject,
  //     );
  //   }
  //   logger.info(`'${picklistName}' collection updated.`);
  // }

  // UPDATES SCHOLARSHIP COLLECTION
  private async updateScholarshipTypes(
    school: string,
    sfAuthHeader: string,
    modality: string,
  ) {
    logMethodAccessInfo(this.updateScholarshipTypes.name);
    const picklistName = await this.keysService.fetchKey(
      TIPO_DE_SOLICITUD_BECA,
      school,
      modality,
    );
    const scholarshipArray = await this.fetchPicklist(
      school,
      picklistName,
      sfAuthHeader,
    );
    const filter = {school, modality};
    await this.scholarshipRepository.deleteAll(filter);
    logger.debug(
      `Scholarship of ${JSON.stringify(
        filter,
      )} deleted from ${SCHOLARSHIP_COLLECTION_NAME}`,
    );

    for (const scholarship of scholarshipArray!) {
      const scholarshipObject = new Scholarship({
        label: scholarship.Label,
        value: createIdWithPrefix('Scholarship', scholarship.Value),
        date: dateString(),
        school,
        modality,
      });
      await this.scholarshipRepository.create(scholarshipObject);
    }
    logger.info(`'${picklistName}' collection updated.`);
  }

  // UPDATES PROOF OF STUDY COLLECTION
  private async updateProofOfStudyTypes(
    school: string,
    sfAuthHeader: string,
    modality: string,
  ) {
    logMethodAccessDebug(this.updateProofOfStudyTypes.name);
    const picklistName = await this.keysService.fetchKey(
      TIPO_DE_CONSTANCIA,
      school,
      modality,
    );
    const proofOfStudiesArray = await this.fetchPicklist(
      school,
      picklistName,
      sfAuthHeader,
    );
    let filter: object;
    switch (school) {
      case ULA:
        filter = {school, modality};
        break;
      default:
        filter = {school};
    }
    await this.proofOfStudyRepository.deleteAll(filter);
    logger.debug(`ProofsOfStudy for '${JSON.stringify(filter)}' deleted`);
    let newProofOfStudyArray: ProofOfStudy[] = [];
    for (const proofOfStudy of proofOfStudiesArray!) {
      const proofOfStudyObj = new ProofOfStudy({
        label: proofOfStudy.Label,
        value: createIdWithPrefix('POS', proofOfStudy.Value),
        school,
      });
      newProofOfStudyArray.push(proofOfStudyObj);
    }
    if (school === ULA) {
      newProofOfStudyArray = newProofOfStudyArray.map(
        doc => new ProofOfStudy({
          ...doc,
          modality,
        }),
      );
    }
    await this.proofOfStudyRepository.createAll(newProofOfStudyArray);
    logger.info(`'${PROOF_OF_STUDY_COLLECTION_NAME}' collection updated`);
  }

  // UPDATES TOTAL STUDY CERTIFICATE COLLECTION
  private async updateTotalStudyCertificateTypes(
    school: string,
    sfAuthHeader: string,
  ) {
    logMethodAccessDebug(this.updateTotalStudyCertificateTypes.name);
    const picklistName = await this.keysService.fetchKey(
      TIPO_DE_CERTIFICADO_TOTAL,
      school,
    );
    const totalStudyCertificateArray = await this.fetchPicklist(
      school,
      picklistName,
      sfAuthHeader,
    );
    const studyCertFilter = {school, identifier: TIPO_DE_CERTIFICADO_TOTAL};
    await this.studyCertificateRepository.deleteAll(studyCertFilter);
    logger.debug(
      `Documents with '${JSON.stringify(studyCertFilter)}' were ` +
      `deleted from '${STUDY_CERTIFICATE_COLLECTION_NAME}' collection`,
    );
    for (const totalStudyCertificate of totalStudyCertificateArray!) {
      const totalStudyCertificateObj = new StudyCertificate({
        label: totalStudyCertificate.Label,
        value: createIdWithPrefix('SCE', totalStudyCertificate.Value),
        school,
        identifier: TIPO_DE_CERTIFICADO_TOTAL,
      });
      await this.studyCertificateRepository.create(totalStudyCertificateObj);
    }
    logger.info(`'${STUDY_CERTIFICATE_COLLECTION_NAME}' collection updated`);
  }

  // UPDATES CAMPUS COLLECTION BLENDED
  private async updateCampusBlended(school: string, authHeader: string) {
    logMethodAccessDebug(this.updateCampusBlended.name);
    const campusArray = await this.campusService.getCampus(authHeader);
    const filter = {school};
    await this.campusRepository.deleteAll(filter);
    logger.debug(
      `Campus with ${JSON.stringify(filter)} ` +
      `deleted from ${CAMPUS_COLLECTION_NAME}`,
    );

    for (const campus of campusArray) {
      const campusObject = new Campus({
        label: campus.salesForceName,
        value: createIdWithPrefix('Campus', campus.salesForceName),
        date: dateString(),
        school,
      });
      await this.campusRepository.create(campusObject);
    }
    logger.info(`'${CAMPUS_COLLECTION_NAME}' collection updated.`);
  }

  // CHECKS IF DATE CHANGED IN PROOF OF STUDY COLLECTION
  private async dateChangedOfProofOfStudy(
    school: string,
    modality: string,
  ): Promise<boolean> {
    logMethodAccessTrace(this.dateChangedOfProofOfStudy.name);
    let filter: object = {
      school
    };
    if (school === ULA)
      filter = {
        school,
        modality
      }
    const firstProofOfStudy = await this.proofOfStudyRepository.findOne({
      where: filter
    });
    if (!firstProofOfStudy)
      return logNoDocFound(PROOF_OF_STUDY_COLLECTION_NAME, filter);
    const lastUpdateDate = firstProofOfStudy.date;
    return this.checkDateChanged(
      lastUpdateDate,
      PROOF_OF_STUDY_COLLECTION_NAME,
    );
  }

  // CHECKS IF DATE CHANGED IN STUDY CERTIFICATE COLLECTION
  private async dateChangedOfStudyCertificate(
    school: string,
    modality: string
  ): Promise<boolean> {
    logMethodAccessTrace(this.dateChangedOfStudyCertificate.name);
    if (school === ULA && modality === ONLINE) return false;
    const certFilter = {
      school,
      identifier: TIPO_DE_CERTIFICADO_TOTAL,
    };
    const someTotalStudyCertificate =
      await this.studyCertificateRepository.findOne({where: certFilter});
    if (!someTotalStudyCertificate)
      return logNoDocFound(STUDY_CERTIFICATE_COLLECTION_NAME, certFilter);
    const lastUpdateDate = someTotalStudyCertificate.date;
    if (!lastUpdateDate) throw undefinedFieldInDoc(
      'date',
      certFilter,
      STUDY_CERTIFICATE_COLLECTION_NAME
    );
    return this.checkDateChanged(
      lastUpdateDate,
      STUDY_CERTIFICATE_COLLECTION_NAME,
    );
  }

  // CHECKS IF DATE CHANGED IN CAMPUS COLLECTION
  private async dateChangedOfCampus(school: string): Promise<boolean> {
    logMethodAccessTrace(this.dateChangedOfCampus.name);
    const someCampus = await this.campusRepository.findOne({
      where: {school},
    });
    if (!someCampus)
      return logNoDocFound(CAMPUS_COLLECTION_NAME, {school});
    const lastUpdateDate = parseDate(someCampus.date);
    return this.checkDateChanged(lastUpdateDate, CAMPUS_COLLECTION_NAME);
  }

  // CHECKS IF DATE CHANGED IN SCHOLARSHIP COLLECTION
  private async dateChangedOfScholarship(school: string): Promise<boolean> {
    logMethodAccessTrace(this.dateChangedOfScholarship.name);
    const someScholarship = await this.scholarshipRepository.findOne({
      where: {school},
    });
    if (!someScholarship)
      return logNoDocFound(SCHOLARSHIP_COLLECTION_NAME, {school});
    const lastUpdateDate = parseDate(someScholarship.date);
    return this.checkDateChanged(
      lastUpdateDate,
      SCHOLARSHIP_COLLECTION_NAME,
    );
  }

  // CHECKS IF DATE CHANGED IN PHOTOSTATICCOPYOFDOCUMENT COLLECTION
  private async dateChangedOfPhotostaticCopyOfDocument(
    school: string,
  ): Promise<boolean> {
    logMethodAccessTrace(this.dateChangedOfPhotostaticCopyOfDocument.name);
    const somePhotostaticDocument =
      await this.photostaticCopyOfDocumentRepository.findOne({
        where: {school},
      });
    if (!somePhotostaticDocument) {
      logger.warn(
        `There are no documents with school '${school}' at ` +
        `'${DOCUMENT_COPY_COLLECTION_NAME}' collection`,
      );
      return true;
    }
    const lastUpdateDate = parseDate(somePhotostaticDocument.date);
    return this.checkDateChanged(
      lastUpdateDate,
      DOCUMENT_COPY_COLLECTION_NAME,
    );
  }

  // CHECKS DATE CHANGED
  private checkDateChanged(date: Date, collection: string): boolean {
    logMethodAccessTrace(this.checkDateChanged.name);
    const dateToday = new Date();
    const dayCurrent = dateToday.getDate();
    const monthCurrent = dateToday.getMonth();
    const yearCurrent = dateToday.getFullYear();
    if (
      date.getDate() !== dayCurrent ||
      date.getMonth() !== monthCurrent ||
      date.getFullYear() !== yearCurrent
    ) {
      logger.debug(
        `An update needs to be performed in '${collection}' collection`,
      );
      return true;
    } else {
      return false;
    }
  }

  // GET URL TO FETCH PICKLIST
  private setPicklistUrl(school: string): string {
    logMethodAccessTrace(this.setPicklistUrl.name);
    switch (school) {
      case UTC:
        return SF_PICKLIST_UTC_URL!;
      case ULA:
        return SF_PICKLIST_ULA_URL!;
      default:
        const errorMessage = `School: ${school} was not found!`;
        logger.fatal(errorMessage);
        throw new HttpErrors.NotFound(errorMessage);
    }
  }

  private async fetchPicklist(
    school: string,
    picklistName: string,
    sfAuthHeader: string,
  ) {
    logMethodAccessDebug(this.fetchPicklist.name);
    const salesforcePicklistURL = this.setPicklistUrl(school);
    const sfPicklistURLwithPicklist = salesforcePicklistURL + picklistName;
    let picklistArray: PicklistInterface[];
    try {
      logger.debug(
        `Trying to fetch '${picklistName}' picklist at '${sfPicklistURLwithPicklist}'`,
      );
      const sfResponse = await this.sfPicklist.getPicklist(
        sfPicklistURLwithPicklist,
        sfAuthHeader,
      );
      picklistArray = sfResponse.picklist;
      logger.debug(`Picklist service answered: "${sfResponse.message}"`);
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        picklistName + ' picklist',
        'Sf-Picklist',
      );
    }
    this.validatePicklistResponse(picklistArray, picklistName);
    return picklistArray;
  }

  private validatePicklistResponse(
    picklistArray: PicklistInterface[],
    picklistName: string,
  ) {
    if (!picklistArray)
      throw this.errorsService.setErrorResponse(
        "No picklist data fetched from salesforce's picklist service",
        'picklist array was empty',
        404,
      );
    logger.info(`${picklistName} picklist data retrieved.`);
  }
}
