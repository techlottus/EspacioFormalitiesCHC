import {service} from '@loopback/core';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {
  SCHOLARSHIP,
  SCHOLARSHIP_ROUTE,
  getScholarshipStatusOk,
  postScholarshipStatusOk
} from '../constants';
import {SSCHCResponse, ScholarshipRB} from '../models';
import {
  badRequest,
  expiredToken,
  getScholarshipSwagger,
  invalidToken,
  notFoundError,
  postScholarshipSwagger,
  unavailableService,
  unprocessableEntityAdditionalProps
} from '../openAPI';
import {
  AuthorizationService,
  KeysService,
  RequestProcedureService,
  ScholarshipService,
  UpdateCollectionsService
} from '../services';
import {successfulChcObject} from '../utils';

export class ScholarshipController {
  constructor(
    @service(AuthorizationService)
    protected authorizationService: AuthorizationService,
    @service(KeysService)
    protected keysService: KeysService,
    @service(RequestProcedureService)
    protected proceduresService: RequestProcedureService,
    @service(ScholarshipService)
    protected scholarshipService: ScholarshipService,
    @service(UpdateCollectionsService)
    protected updateCollectionsService: UpdateCollectionsService,
  ) { }

  @get(SCHOLARSHIP_ROUTE)
  @response(200, getScholarshipSwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(503, unavailableService)
  async find(
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {
    // GRANT AUTHORIZATION
    const {school, modality} =
      await this.authorizationService.checkAuthorization(
        SCHOLARSHIP_ROUTE,
        serviceId,
        serviceName,
        authHeader,
      );

    // UPDATE COLLECTIONS IF NEEDED
    await this.updateCollectionsService.checkUpdateScholarship(
      school,
      modality,
    );

    // SEND RESPONSE
    const data = await this.scholarshipService.fetchScholarshipData(
      school, modality
    );
    return successfulChcObject(data, 200, getScholarshipStatusOk);
  }

  @post(SCHOLARSHIP_ROUTE)
  @response(201, postScholarshipSwagger)
  @response(400, badRequest)
  @response(401, invalidToken)
  @response(403, expiredToken)
  @response(404, notFoundError)
  @response(422, unprocessableEntityAdditionalProps)
  @response(503, unavailableService)
  async requestAdmissionCertificate(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ScholarshipRB),
        },
      },
    })
    requestBody: ScholarshipRB,
    @param.header.string('Service-Id') serviceId: string,
    @param.header.string('Service-Name') serviceName: string,
    @param.header.string('Authorization') authHeader: string,
  ): Promise<SSCHCResponse> {

    // GRANT AUTHORIZATION
    const studentData = await this.authorizationService.checkAuthorization(
      SCHOLARSHIP_ROUTE,
      serviceId,
      serviceName,
      authHeader,
    );

    // SET PROPERTIES
    const servicioObject =
      await this.scholarshipService.setScholarshipServiceProperties(
        studentData,
        requestBody,
      );

    const sfRequestBody = await this.proceduresService.setSfRequestBody(
      servicioObject,
      requestBody.files,
      studentData,
      SCHOLARSHIP,
    );

    // REQUEST 'Beca' to SALESFORCE
    const ticketNumber = await this.proceduresService.requestProcedure(
      studentData.school,
      'Beca',
      sfRequestBody,
    );

    // SEND OK RESPONSE
    const data = {
      ticketNumber,
    };
    return successfulChcObject(data, 201, postScholarshipStatusOk);
  }
}
