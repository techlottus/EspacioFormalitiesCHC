import {Entity, model, property} from '@loopback/repository';
import {QR_VALIDATION_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: QR_VALIDATION_COLLECTION_NAME},
  }
})
export class QrValidation extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  studentName: string;

  @property({
    type: 'string',
    required: true,
  })
  school: string;

  @property({
    type: 'string',
    required: true,
  })
  enrollmentNumber: string;

  @property({
    type: 'string',
    required: true
  })
  email: string;

  @property({
    type: 'string',
    required: true
  })
  campus: string;

  @property({
    type: 'string',
    required: true,
  })
  procedureName: string;

  @property({
    type: 'string',
    required: true,
  })
  sfTicketNumber: string;

  constructor(data?: Partial<QrValidation>) {
    super(data);
  }
}
