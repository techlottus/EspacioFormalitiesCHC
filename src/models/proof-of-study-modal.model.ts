import {Entity, model, property} from '@loopback/repository';
import {PROOF_OF_STUDY_MODAL_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: PROOF_OF_STUDY_MODAL_COLLECTION_NAME}
  }
})
export class ProofOfStudyModal extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  label: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  value: string;

  @property({
    type: 'string',
    required: true,
    unique: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  imageUrl: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  school: string;

  @property({
    type: 'string',
    hidden: true,
  })
  modality?: string;


  constructor(data?: Partial<ProofOfStudyModal>) {
    super(data);
  }
}
