import {Entity, model, property} from '@loopback/repository';
import {PROOF_OF_STUDY_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: PROOF_OF_STUDY_COLLECTION_NAME}
  }
})
export class ProofOfStudy extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'string',
  })
  value: string;

  @property({
    type: 'Date',
    default: new Date(),
    hidden: true,
  })
  date: Date;

  @property({
    type: 'string',
    required: true,
  })
  school: string;

  @property({
    type: 'string',
  })
  modality?: string;

  constructor(data?: Partial<ProofOfStudy>) {
    super(data);
  }
}
