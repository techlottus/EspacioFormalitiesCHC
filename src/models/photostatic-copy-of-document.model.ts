import {Entity, model, property} from '@loopback/repository';

@model()
export class PhotostaticCopyOfDocument extends Entity {
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
  date?: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  school?: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  modality?: string;

  constructor(data?: Partial<PhotostaticCopyOfDocument>) {
    super(data);
  }
}
