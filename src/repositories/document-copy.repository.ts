import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {DocumentCopy} from '../models';

export class DocumentCopyRepository extends DefaultCrudRepository<
  DocumentCopy,
  typeof DocumentCopy.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation')
    dataSource: MongodbLottusEducationDataSource,
  ) {
    super(DocumentCopy, dataSource);
  }
}
