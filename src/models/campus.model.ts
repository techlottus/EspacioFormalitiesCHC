import {Entity, model, property} from '@loopback/repository';
import {CAMPUS_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: CAMPUS_COLLECTION_NAME}
  }
})
export class Campus extends Entity {
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

  constructor(data?: Partial<Campus>) {
    super(data);
  }
}
