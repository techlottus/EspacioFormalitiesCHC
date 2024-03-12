import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {SUBSCHOOL, ULABYUANE, UTC, UTCBYUANE} from '../constants';
import {MongodbLottusEducationDataSource} from '../datasources';
import {AcademicLevels} from '../models';

export class AcademicLevelsRepository extends DefaultCrudRepository<
  AcademicLevels,
  typeof AcademicLevels.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(AcademicLevels, dataSource);
  }

  //change name of school to 'UTCBYUANE' or 'ULABYUANE' if are the modalities  1T, BO, 1P and school
  async changeSchoolNameByModality(
    levelCode: string,
    school: string,
  ) {
    const levelsFilter = {school, identifier: SUBSCHOOL};
    const levelsDoc = await this.findOne({
      where: levelsFilter,
    });
    return levelsDoc?.levels.includes(levelCode)
      ? school === UTC
        ? UTCBYUANE
        : ULABYUANE
      : school;
  };
}
