import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Scholarship} from '../models';

export class ScholarshipRepository extends DefaultCrudRepository<
  Scholarship,
  typeof Scholarship.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation')
    dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Scholarship, dataSource);
  }
}
