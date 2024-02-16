import {Entity, model, property} from '@loopback/repository';
import {DOCUMENT_COPY_COLLECTION_NAME} from '../constants/collections.constants';

@model({
  settings: {
    mongodb: {collection: DOCUMENT_COPY_COLLECTION_NAME},
  },
})
export class CopyOfDocument extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  school: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  modality: string;

  constructor(data?: Partial<CopyOfDocument>) {
    super(data);
  }
}
