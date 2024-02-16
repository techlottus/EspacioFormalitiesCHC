import {BindingScope, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {CommonPropertiesService} from '.';
import {
  DOCUMENT_COPY_COLLECTION_NAME,
  UTEG,
} from '../constants';
import {PhotostaticCopyOfDocument_UTEG, StudentData} from '../interfaces';
import {DocumentCopyRB} from '../models';
import {
  DocumentCopyRepository,
  PhotostaticCopyOfDocumentRepository,
} from '../repositories';
import {
  logMethodAccessDebug,
  logMethodAccessTrace,
  logger,
  missingPropertyError,
  noDocFoundError,
  schoolError,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class DocumentCopyService {
  constructor(
    @service(CommonPropertiesService)
    public commonPropertiesService: CommonPropertiesService,
    @repository(PhotostaticCopyOfDocumentRepository)
    protected photoStaticCopyOfDocumentRepository: PhotostaticCopyOfDocumentRepository,
    @repository(DocumentCopyRepository)
    protected copyOfDocumentRepository: DocumentCopyRepository,
  ) { }

  async fetchDocumentCopyTypesData() {
    logMethodAccessDebug(this.fetchDocumentCopyTypesData.name);
    const filter = {identifier: 'PhotostaticCopyOfDocumentOptions'};
    const DocumentCopyTypesData = await this.copyOfDocumentRepository.find({
      where: filter,
    });
    if (!DocumentCopyTypesData.length)
      throw noDocFoundError(DOCUMENT_COPY_COLLECTION_NAME, filter);
    return DocumentCopyTypesData[0]['DocumentCopyTypes'];
  }

  async fetchphotostaticCopyOfDocumentData(school: string, modality: string) {
    logMethodAccessDebug(this.fetchphotostaticCopyOfDocumentData.name);
    const filter = {school, modality};
    const photoStaticCopyOfDocumentData =
      await this.photoStaticCopyOfDocumentRepository.find({
        where: filter,
      });
    if (!photoStaticCopyOfDocumentData.length)
      throw noDocFoundError(DOCUMENT_COPY_COLLECTION_NAME, filter);
    return photoStaticCopyOfDocumentData;
  }

  setPhotoStaticCopyOfDocumentServiceProperties(
    studentData: StudentData,
    requestBody: DocumentCopyRB,
  ) {
    logMethodAccessTrace(
      this.setPhotoStaticCopyOfDocumentServiceProperties.name,
    );
    const {school, modality} = studentData;
    switch (school) {
      case UTEG:
        return this.setScolarShipServicioProperties_UTEG(
          studentData,
          requestBody,
          modality,
        );
      default:
        throw schoolError(school);
    }
  }

  private async setScolarShipServicioProperties_UTEG(
    studentData: StudentData,
    requestBody: DocumentCopyRB,
    modality: string,
  ) {
    logMethodAccessDebug(this.setScolarShipServicioProperties_UTEG.name);
    const commonProperties =
      this.commonPropertiesService.setCommonPropertiesUteg(
        studentData,
        requestBody,
      );
    let photostaticCopyOfDocumentProperties: PhotostaticCopyOfDocument_UTEG;

    if (!requestBody.documentTypeValue)
      throw missingPropertyError('documentTypeValue');
    photostaticCopyOfDocumentProperties = {
      ...commonProperties,
      Tipo_de_Documento__c: await this.setPhotostaticCopyOfDocumentSelect(
        requestBody.documentTypeValue,
      ),
    };

    photostaticCopyOfDocumentProperties = commonProperties;

    logger.debug(
      `PhotostaticCopyOfDocument properties setted: ${JSON.stringify(
        photostaticCopyOfDocumentProperties,
      )}`,
    );
    return photostaticCopyOfDocumentProperties;
  }

  // SETS PHOTOSTATICCOPYOFDOCUMENT  FOR THE SELECT FIELD
  async setPhotostaticCopyOfDocumentSelect(
    documentTypeValue: string,
  ): Promise<string> {
    logMethodAccessTrace(this.setPhotostaticCopyOfDocumentSelect.name);
    const filter = {value: documentTypeValue};
    const photostaticCopyOfDocument =
      await this.photoStaticCopyOfDocumentRepository.findOne({
        where: filter,
      });
    if (!photostaticCopyOfDocument)
      throw noDocFoundError(DOCUMENT_COPY_COLLECTION_NAME, filter);
    const {label} = photostaticCopyOfDocument;
    logger.debug(
      `Scholarship found. Value: ${documentTypeValue}, Label: ${label}`,
    );
    return label;
  }
}
