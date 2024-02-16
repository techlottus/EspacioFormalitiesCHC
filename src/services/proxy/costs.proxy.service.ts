import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PaymentsDataSource} from '../../datasources';
import {CampusServiceInterface} from '../../interfaces';


export interface CostosBody {
  service: CampusServiceInterface,
  data: {
    detailCodes: string[]
  }
}

export interface CostObject {
  cost: number,
  codeDetail: string
}

export interface CostsResponse {
  service: CampusServiceInterface,
  data: CostObject[]
}

export interface Costs {
  getCostsOfDetailIds(
    authHeader: string,
    serviceId: string,
    costsBody: CostosBody,
    URL: string
  ): Promise<CostsResponse>
}

export class CostsProvider implements Provider<Costs> {
  constructor(
    // costs must match the name property in the datasource json file
    @inject('datasources.payments')
    protected dataSource: PaymentsDataSource = new PaymentsDataSource(),
  ) { }

  value(): Promise<Costs> {
    return getService(this.dataSource);
  }
}
