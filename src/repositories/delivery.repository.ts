import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DELIVERY_COLLECTION_NAME} from '../constants';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Delivery} from '../models';
import {logMethodAccessDebug, logger, noDocFoundError} from '../utils';

export class DeliveryRepository extends DefaultCrudRepository<
  Delivery,
  typeof Delivery.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Delivery, dataSource);
  }

  async fetchDeliveryArray(filter: object) {
    logMethodAccessDebug(this.fetchDeliveryArray.name);
    const deliveryArray = await this.find({where: filter});
    if (!deliveryArray.length)
      throw noDocFoundError(
        DELIVERY_COLLECTION_NAME,
        filter
      );
    logger.debug('Delivery array fetched');
    return deliveryArray;
  }

}
