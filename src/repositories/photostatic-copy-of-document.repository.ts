import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {CopyOfDocument} from '../models';

export class PhotostaticCopyOfDocumentRepository extends DefaultCrudRepository<
  CopyOfDocument,
  typeof CopyOfDocument.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation')
    dataSource: MongodbLottusEducationDataSource,
  ) {
    super(CopyOfDocument, dataSource);
  }
}
