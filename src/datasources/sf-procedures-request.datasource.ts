import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'sfProceduresRequest',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: 'Bearer {accessToken}'
    },
  },
  operations: [
    {
      template: {
        method: 'POST',
        url: '{sfRequestProcedureUrl}',
        headers: {
          Authorization: '{accessToken}',
        },
        body: '{sfRequestBody}'
      },
      functions: {
        sendProcedureRequest: ['sfRequestProcedureUrl', 'accessToken', 'sfRequestBody'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class SfProceduresRequestDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'sfProceduresRequest';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.sfProceduresRequest', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
