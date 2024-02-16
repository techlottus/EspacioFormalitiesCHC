/////////////////// RequestProcedureService /////////////////
// Handles requests to Salesforce ServiciosEscolares service
// via sf-servicios-escolares proxy service
/////////////////////////////////////////////////////////////

import {BindingScope, inject, injectable, service} from '@loopback/core';
import {
  ErrorsService,
  KeysService,
  SfCoreService,
  SfProcedureRequest,
  SfProcedureResponse
} from '.';
import {
  SF_PROCEDURE_REQUEST_ULA_URL,
  SF_PROCEDURE_REQUEST_UTC_URL,
  SF_PROCEDURE_REQUEST_UTEG_URL,
  ULA,
  UTC,
  UTEG
} from '../constants';
import {SfRequestBody, StudentData} from '../interfaces';
import {Files64} from '../models';
import {logMethodAccessDebug, logger, schoolError} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class RequestProcedureService {
  constructor(
    @inject('services.SfProcedureRequest')
    protected sfProcedureRequest: SfProcedureRequest,
    @service(KeysService)
    protected keysService: KeysService,
    @service(SfCoreService)
    protected sfCoreService: SfCoreService,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) { }

  async setSfRequestBody(
    servicioObject: object,
    files: Files64[],
    studentData: StudentData,
    identifier: string,
  ): Promise<SfRequestBody> {
    logMethodAccessDebug(this.setSfRequestBody.name);
    const recordTypeId = await this.keysService.fetchKey(
      identifier,
      studentData.school,
      studentData.modality
    );
    const sfRequestBody: SfRequestBody = {
      servicio: [servicioObject],
      files: files,
      matricula: studentData.enrollmentNumber,
      recordtype: recordTypeId
    };
    return sfRequestBody;
  }

  async requestProcedure(
    school: string,
    procedure: string,
    sfRequestBody: SfRequestBody,
  ): Promise<string> {
    logMethodAccessDebug(this.requestProcedure.name);
    const requestprocedureUrl = this.fetchRequestProcedureUrl(school);
    const sfAccessToken = await this.sfCoreService.getSfAccessToken(school);
    logger.info(`Requesting '${procedure}' to Salesforce ` +
      `'serviciosEscolares' service at ${requestprocedureUrl}`);
    const {files, ...bodyWithoutFiles} = sfRequestBody;
    logger.debug(`RequestBody (without files array) sent to SF: ` +
      `${JSON.stringify(bodyWithoutFiles)}`);
    let sfResponse: SfProcedureResponse;
    try {
      sfResponse = await this.sfProcedureRequest.sendProcedureRequest(
        requestprocedureUrl,
        sfAccessToken,
        sfRequestBody,
      );
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        procedure,
        'Servicios Escolaress'
      );
    }
    this.validateSfResponse(sfResponse, procedure);
    return sfResponse.ticket;
  }

  private fetchRequestProcedureUrl(school: string): string {
    switch (school) {
      case UTC:
        return SF_PROCEDURE_REQUEST_UTC_URL!;
      case ULA:
        return SF_PROCEDURE_REQUEST_ULA_URL!;
      case UTEG:
        return SF_PROCEDURE_REQUEST_UTEG_URL!
      default:
        throw schoolError(school);
    }
  }

  private validateSfResponse(
    sfResponse: SfProcedureResponse,
    procedure: string
  ) {
    if (!sfResponse.ticket || !sfResponse.message)
      throw this.errorsService.setErrorResponse(
        `Unable to fetch ${procedure}`,
        "Unexpected response format from Sf service",
        500
      );
    logger.info(`'${procedure}' requested successfully.`);
    logger.debug(`Salesforce response object: ${JSON.stringify(sfResponse)}`);
  }
}
