import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {BackLogs} from '../models';

export class BackLogsRepository extends DefaultCrudRepository<
  BackLogs,
  typeof BackLogs.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(BackLogs, dataSource);
  }
}
