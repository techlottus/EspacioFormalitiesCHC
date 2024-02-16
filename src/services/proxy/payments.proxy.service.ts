import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PaymentsDataSource} from '../../datasources';
import {CampusServiceInterface} from '../../interfaces';

interface PaymentsData {
  userId: string,
  ticket: string,
  detailId: string
};

interface PaymentsInfoError {
  id: string,
  info: string
};

export interface PaymentsBody {
  service: CampusServiceInterface,
  data: PaymentsData
}

export interface PaymentsResponse {
  service: CampusServiceInterface,
  data: {
    transactionNumber: number
  },
  status: PaymentsInfoError,
  error: PaymentsInfoError
}

export interface Payments {
  fetchTransactionNumberFromPayments(
    authHeader: string,
    serviceId: string,
    requestBody: PaymentsBody,
    URL: string
  ): Promise<PaymentsResponse>
}

export class PaymentsProvider implements Provider<Payments> {
  constructor(
    // payments must match the name property in the datasource json file
    @inject('datasources.payments')
    protected dataSource: PaymentsDataSource = new PaymentsDataSource(),
  ) { }

  value(): Promise<Payments> {
    return getService(this.dataSource);
  }
}
