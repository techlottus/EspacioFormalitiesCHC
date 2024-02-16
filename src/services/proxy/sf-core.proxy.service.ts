///////////////   SfCore Proxy Service   ////////////////
// It's a proxy service
// Handles communication with Salesfore-Core service
// via ssCore datasource
/////////////////////////////////////////////////////////

import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {SsCoreDataSource} from '../../datasources';

export interface SfCoreResponse {
  sfData: {
    accessToken: string,
    tokenType: string
  }
}

export interface SfCore {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getSfAccessToken(sfCoreUrl: string): Promise<SfCoreResponse>
}

export class SfCoreProvider implements Provider<SfCore> {
  constructor(
    // ssCore must match the name property in the datasource json file
    @inject('datasources.ssCore')
    protected dataSource: SsCoreDataSource = new SsCoreDataSource(),
  ) { }

  value(): Promise<SfCore> {
    return getService(this.dataSource);
  }
}
