import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbLottusEducationDataSource} from '../datasources';
import {ProofOfStudyModal} from '../models';

export class ModalProofOfStudyRepository extends DefaultCrudRepository<
  ProofOfStudyModal,
  typeof ProofOfStudyModal.prototype.id
> {
  constructor(
    @inject('datasources.mongodbLottusEducation') dataSource: MongodbLottusEducationDataSource,
  ) {
    super(ProofOfStudyModal, dataSource);
  }
}
