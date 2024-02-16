///////////   SfPicklist Proxy Service   ///////////
// It's a proxy service
// Handles communication with Salesforce picklist service
// via picklistSalesforce datasource
////////////////////////////////////////////////////

import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PicklistSalesforceDataSource} from '../../datasources';

export interface PicklistInterface {
  Value: 'string',
  Label: 'string'
}
export interface SfPicklistResponse {
  picklist: PicklistInterface[],
  message: string,
  error: boolean
}

export interface SfPicklist {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  getPicklist(urlPicklist: string, accessToken: string): Promise<SfPicklistResponse>
}

export class SfPicklistProvider implements Provider<SfPicklist> {
  constructor(
    // picklistSalesforce must match the name property in the datasource json file
    @inject('datasources.picklistSalesforce')
    protected dataSource: PicklistSalesforceDataSource = new PicklistSalesforceDataSource(),
  ) { }

  value(): Promise<SfPicklist> {
    return getService(this.dataSource);
  }
}
