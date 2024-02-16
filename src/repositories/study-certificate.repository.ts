import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {StudyCertificate} from '../models';

export class StudyCertificateRepository extends DefaultCrudRepository<
  StudyCertificate,
  typeof StudyCertificate.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(StudyCertificate, dataSource);
  }
}
