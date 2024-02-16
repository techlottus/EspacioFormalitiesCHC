/////////// Sf Servicios Escolares Proxy Service ///////////////
// This is a proxy service
// Handles communication with Salesforce Servicios Escolares service
// via sfProceduresRequest datasource
////////////////////////////////////////////////////////////////

import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {SfProceduresRequestDataSource} from '../../datasources';

export interface SfProcedureResponse {
  ticket: string,
  message: string,
  error: boolean,
  name?: string
}

export interface SfProcedureRequest {
  sendProcedureRequest(
    sfRequestProcedureUrl: string,
    accessToken: string,
    sfRequestBody: object
  ): Promise<SfProcedureResponse>
}

export class SfProcedureRequestProvider implements Provider<SfProcedureRequest> {
  constructor(
    // sfProceduresRequest must match the name property in the datasource json file
    @inject('datasources.sfProceduresRequest')
    protected dataSource: SfProceduresRequestDataSource = new SfProceduresRequestDataSource(),
  ) { }

  value(): Promise<SfProcedureRequest> {
    return getService(this.dataSource);
  }
}
