import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'payments',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: '{authHeader}',
      'Service-Id': '{serviceId}'
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: '{URL}',
        headers: {
          Authorization: '{authHeader}',
          'Service-Id': '{serviceId}'
        },
        body: '{requestBody}'
      },
      functions: {
        fetchTransactionNumberFromPayments: [
          'authHeader',
          'serviceId',
          'requestBody',
          'URL'
        ],
        getCostsOfDetailIds: [
          'authHeader',
          'serviceId',
          'requestBody',
          'URL'
        ],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PaymentsDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'payments';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.payments', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
