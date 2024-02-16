import {Entity, model, property} from '@loopback/repository';
import {SCHOLARSHIP_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: SCHOLARSHIP_COLLECTION_NAME},
  },
})
export class Scholarship extends Entity {

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

  constructor(data?: Partial<Scholarship>) {
    super(data);
  }
}
