import {service} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {
  DOCUMENT_COPY_V1_ROUTE,
  getDocumentCopyOk,
  postDocumentCopyOk,
} from '../constants';
import {DocumentCopyRB, SSCHCResponse} from '../models';
import {
  badRequest,
  expiredToken,
  getDocumentCopySwagger,
  invalidToken,
  notFoundError,
  postDocumentCopySwagger,
  unavailableService,
  unprocessableEntityAdditionalProps,
} from '../openAPI';
import {
  AuthorizationService,
  DocumentCopyService,
  KeysService,
  RequestProcedureService,
  UpdateCollectionsService,
} from '../services';
import {successfulChcObject} from '../utils';

export class DocumentCopyController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(UpdateCollectionsService)
    protected updateCollectionsService: UpdateCollectionsService,
    @service(DocumentCopyService)
    protected photostaticCopyOfDocumentService: DocumentCopyService,
    @service(KeysService)
    protected keysService: KeysService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
  ) { }

  @get(DOCUMENT_COPY_V1_ROUTE)
  @response(200, getDocumentCopySwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async getPhotostaticCopyOfDocument(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      DOCUMENT_COPY_V1_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // UPDATE COLLECTIONS IF NEEDED
    // const {school, modality} = studentData;
    // await this.updateCollectionsService.checkUpdatePhotostaticCopyOfDocument(
    //   school,
    //   modality,
    // );

    // SEND RESPONSE
    // const data =
    //   await this.photostaticCopyOfDocumentService.fetchphotostaticCopyOfDocumentData(
    //     school,
    //     modality,
    //   );

    // REQUEST 'dummy data' of mongoDB
    const documentCopyTypesData =
      await this.photostaticCopyOfDocumentService.fetchDocumentCopyTypesData();

    return successfulChcObject(
      documentCopyTypesData,
      200,
      getDocumentCopyOk,
    );
  }

  @post(DOCUMENT_COPY_V1_ROUTE)
  @response(201, postDocumentCopySwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityAdditionalProps)
  @response(503, unavailableService)
  async postPhotostaticCopyOfDocument(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentCopyRB),
        },
      },
    })
    requestBody: DocumentCopyRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      DOCUMENT_COPY_V1_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET PROPERTIES
    // const servicioObject =
    //   await this.photostaticCopyOfDocumentService.setPhotoStaticCopyOfDocumentServiceProperties(
    //     studentData,
    //     requestBody,
    //   );

    // const sfRequestBody = await this.proceduresService.setSfRequestBody(
    //   servicioObject,
    //   requestBody.files,
    //   studentData,
    //   PHOTOSTATIC_COPY_OF_DOCUMENT,
    // );

    //REQUEST 'photostatic Copy Of Document' to SALESFORCE
    // const ticketNumber = await this.proceduresService.requestProcedure(
    //   studentData.school,
    //   'Photo static Copy Of Document',
    //   sfRequestBody,
    // );

    // SEND OK RESPONSE
    const data = {
      ticketNumber: '12345677',
      transactionNumber: '1234567',
    };

    return successfulChcObject(data, 201, postDocumentCopyOk);
  }
}
