import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DETAIL_CODES_COLLECTION_NAME} from '../constants';
import {MongodbLottusEducationDataSource} from '../datasources';
import {DetailCodes} from '../models';
import {logger, logMethodAccessTrace, noDocFoundError} from '../utils';

export class DetailCodesRepository extends DefaultCrudRepository<
  DetailCodes,
  typeof DetailCodes.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(DetailCodes, dataSource);
  }

  async fetchDetailCode(filter: object) {
    logMethodAccessTrace(this.fetchDetailCode.name);
    const detailCodeDocument = await this.findOne({where: filter});
    if (!detailCodeDocument) throw noDocFoundError(
      DETAIL_CODES_COLLECTION_NAME,
      filter
    );
    const detailCode = detailCodeDocument.detailCode;
    logger.debug(`Detail code fetched: ${detailCode}`);
    return detailCode;
  }
}
