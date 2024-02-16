import {Entity, model, property} from '@loopback/repository';
import {CALENDAR_COLLECTION_NAME} from '../constants/collections.constants';

@model({
  settings: {
    mongodb: {collection: CALENDAR_COLLECTION_NAME},
  },
})
export class Calendar extends Entity {
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
  name: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  school: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  modality?: string[];

  @property({
    type: 'string',
    hidden: true,
  })
  selector?: string;

  @property({
    type: 'string',
    required: true,
  })
  urlPdf?: string;

  @property({
    type: 'string',
    required: true,
  })
  urlImageSymbol?: string;

  @property({
    type: 'string',
    required: true,
  })
  urlImageCalendar?: string;

  @property({
    type: 'array',
    itemType: 'string',
    hidden: true,
  })
  academicLevels: string[];

  @property({
    type: 'array',
    itemType: 'string',
    hidden: true,
  })
  periods: string[];

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  view?: string;

  @property({
    type: 'number',
    required: true,
    hidden: true,
  })
  year?: number;

  constructor(data?: Partial<Calendar>) {
    super(data);
  }
}
