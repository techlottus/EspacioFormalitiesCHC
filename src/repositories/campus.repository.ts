import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Campus} from '../models';

export class CampusRepository extends DefaultCrudRepository<
  Campus,
  typeof Campus.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Campus, dataSource);
  }
}
