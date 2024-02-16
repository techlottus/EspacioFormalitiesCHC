import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {SocialService} from '../models';

export class SocialServiceRepository extends DefaultCrudRepository<
  SocialService,
  typeof SocialService.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(SocialService, dataSource);
  }
}
