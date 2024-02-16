import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongodb: {collection: "SS_Keys"}
  }
})
export class Keys extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  identifier: string;

  @property({
    type: 'string',
    required: true,
  })
  key: string;

  @property({
    type: 'string',
    required: true,
  })
  school: string;

  @property({
    type: 'string',
  })
  modality?: string;

  @property({
    type: 'string',
  })
  acrom?: string;

  @property({
    type: 'string',
  })
  description: string;

  constructor(data?: Partial<Keys>) {
    super(data);
  }
}
