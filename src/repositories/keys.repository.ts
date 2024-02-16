import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Keys} from '../models';

export class KeysRepository extends DefaultCrudRepository<
  Keys,
  typeof Keys.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Keys, dataSource);
  }
}
