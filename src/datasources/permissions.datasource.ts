import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'permissions',
  connector: 'rest',
  options: {
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: '{authHeader}',
      'Service-Id': '{serviceId}',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: '{permissionsUrl}',
        headers: {
          Authorization: '{authHeader}',
          'Service-Id': '{serviceId}',
        },
      },
      functions: {
        fetchAcademicHistoryData: ['authHeader', 'serviceId', 'permissionsUrl'],
        fetchReportCardData: ['authHeader', 'serviceId', 'permissionsUrl'],
        fetchCampusData: ['authHeader', 'serviceId', 'permissionsUrl'],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class PermissionsDataSource
  extends juggler.DataSource
  implements LifeCycleObserver
{
  static dataSourceName = 'permissions';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.permissions', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
