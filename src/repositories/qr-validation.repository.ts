import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {QrValidation} from '../models';
import {StudentData} from '../interfaces';
import {logMethodAccessInfo, logger} from '../utils';
import {QR_VALIDATION_COLLECTION_NAME} from '../constants';

export class QrValidationRepository extends DefaultCrudRepository<
  QrValidation,
  typeof QrValidation.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation')
    dataSource: MongodbLottusEducationDataSource,
  ) {
    super(QrValidation, dataSource);
  }

  async saveProcedureData(
    studentData: StudentData,
    procedureName: string,
    sfTicketNumber: string,
    delivery: string
  ) {
    logMethodAccessInfo(this.saveProcedureData.name);
    const procedureData = new QrValidation({
      studentName: studentData.name,
      school: studentData.school,
      enrollmentNumber: studentData.enrollmentNumber,
      email: studentData.email,
      campus: studentData.campus,
      procedureName,
      sfTicketNumber,
      delivery
    });
    const procedureDataSaved = await this.create(procedureData);
    logger.info(
      `Procedure data saved into '${QR_VALIDATION_COLLECTION_NAME}' collection`
    );
  }
}
