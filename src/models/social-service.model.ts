import {Entity, model, property} from '@loopback/repository';
import {SOCIAL_SERVICE_COLLECTION_NAME} from '../constants';

@model()
export class Steps {
  @property({
    type: 'number',
    required: true,
  })
  step: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  text: string;
}

@model({
  settings: {
    mongodb: {collection: SOCIAL_SERVICE_COLLECTION_NAME}
  }
})
export class SocialService extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  id?: string;

  @property({
    type: 'string'
  })
  acrom?: string;

  @property({
    type: 'string',
  })
  type?: string;

  @property({
    type: 'boolean',
    hidden: true,
  })
  socialServiceType?: boolean;

  @property({
    type: 'string',
    hidden: true,
  })
  description?: string;

  @property({
    type: 'string',
  })
  link?: string;

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
  identifier?: string;

  @property({
    type: 'array',
    itemType: Steps,
  })
  steps?: Steps[];

  constructor(data?: Partial<SocialService>) {
    super(data);
  }
}
