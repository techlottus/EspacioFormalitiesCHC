import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PermissionsDataSource} from '../../datasources';
import {CampusServiceInterface} from '../../interfaces';

export interface CampusObject {
  bannerName: string; //name campus of banner
  code: string; // campus code
  salesForceName: string; // name campus name of saleforce
}

export interface PermissionsResponse {
  service: CampusServiceInterface;
  data: CampusObject[];
}

export interface Campus {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  fetchCampusData(
    authHeader: string,
    serviceId: string,
    permissionsUrl: string,
  ): Promise<PermissionsResponse>;
}

export class CampusProvider implements Provider<Campus> {
  constructor(
    // permissions must match the name property in the datasource json file
    @inject('datasources.permissions')
    protected dataSource: PermissionsDataSource = new PermissionsDataSource(),
  ) { }

  value(): Promise<Campus> {
    return getService(this.dataSource);
  }
}
