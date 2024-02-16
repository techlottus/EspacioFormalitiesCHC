import {Entity, model, property} from '@loopback/repository';
import {PhotostaticCopyOfDocument} from '.';
import {DOCUMENT_COPY_COLLECTION_NAME} from '../constants';

@model({
  settings: {
    mongodb: {collection: DOCUMENT_COPY_COLLECTION_NAME},
  },
})
export class DocumentCopy extends Entity {
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
    hidden: true,
  })
  identifier: string;

  @property({
    type: 'array',
    itemType: PhotostaticCopyOfDocument,
  })
  DocumentCopyTypes: Array<PhotostaticCopyOfDocument>;

  constructor(data?: Partial<DocumentCopy>) {
    super(data);
  }
}
