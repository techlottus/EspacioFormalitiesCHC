import {Entity, model, property} from '@loopback/repository';
import {DETAIL_CODES_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: DETAIL_CODES_COLLECTION_NAME}
  }
})
export class DetailCodes extends Entity {
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
  })
  description: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  identifiers?: string[];

  @property({
    type: 'string',
    required: true,
  })
  detailCode: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  levels?: string[];

  @property({
    type: 'string',
    required: true,
  })
  school: string;

  @property({
    type: 'string',
    required: true,
  })
  procedure: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  campus?: string[];

  @property({
    type: 'string',
  })
  identifier?: string;

  @property({
    type: 'string',
  })
  modality?: string;

  constructor(data?: Partial<DetailCodes>) {
    super(data);
  }
};
