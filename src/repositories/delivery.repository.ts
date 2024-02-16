import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Delivery} from '../models';

export class DeliveryRepository extends DefaultCrudRepository<
  Delivery,
  typeof Delivery.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Delivery, dataSource);
  }
}
