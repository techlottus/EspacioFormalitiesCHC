import {Entity, model, property} from '@loopback/repository';
import {DELIVERY_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: DELIVERY_COLLECTION_NAME}
  }
})
export class Delivery extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  _id: string;

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
  school: string;

  constructor(data?: Partial<Delivery>) {
    super(data);
  }
}
