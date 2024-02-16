import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {AcademicLevels} from '../models';

export class AcademicLevelsRepository extends DefaultCrudRepository<
  AcademicLevels,
  typeof AcademicLevels.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(AcademicLevels, dataSource);
  }
}
