import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Calendar} from '../models';

export class CalendarsRepository extends DefaultCrudRepository<
  Calendar,
  typeof Calendar.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation')
    dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Calendar, dataSource);
  }
}
