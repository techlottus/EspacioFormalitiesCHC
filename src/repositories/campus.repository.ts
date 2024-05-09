import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {CAMPUS_COLLECTION_NAME} from '../constants';
import {MongodbLottusEducationDataSource} from '../datasources';
import {Campus} from '../models';
import {logMethodAccessDebug, logger, noDocFoundError} from '../utils';

export class CampusRepository extends DefaultCrudRepository<
  Campus,
  typeof Campus.prototype._id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(Campus, dataSource);
  }

  async fetchCampusArray(school: string) {
    logMethodAccessDebug(this.fetchCampusArray.name);
    const filter = {school};
    const campusArray = await this.find({where: filter});
    if (!campusArray.length)
      throw noDocFoundError(
        CAMPUS_COLLECTION_NAME,
        filter
      );
    logger.debug('Campus array fetched');
    return campusArray;
  }
}
