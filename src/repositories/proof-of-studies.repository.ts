import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {ProofOfStudy} from '../models';

export class ProofOfStudyRepository extends DefaultCrudRepository<
  ProofOfStudy,
  typeof ProofOfStudy.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(ProofOfStudy, dataSource);
  }
}
