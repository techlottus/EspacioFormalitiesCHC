import {Model, model, property} from '@loopback/repository';
import {Files64} from '.';

@model()
export class CommonsRB extends Model {

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  phoneNumber: string | null;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  comments: string | null;

  @property({
    type: 'array',
    itemType: Files64,
  })
  files: Files64[];

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true
    }
  })
  delivery?: string | null;

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true
    }
  })
  campus?: string | null;

  @property({
    type: 'boolean',
  })
  chargeAccepted?: boolean;

  constructor(data?: Partial<CommonsRB>) {
    super(data);
  }
}
