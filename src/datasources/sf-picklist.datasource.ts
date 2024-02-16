import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'sfPicklist',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: '{accessToken}'
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: '{urlPicklist}',
        headers: {
          Authorization: '{accessToken}',
        },
      },
      functions: {
        getPicklist: ['urlPicklist', 'accessToken'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PicklistSalesforceDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'picklistSalesforce';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.picklistSalesforce', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
