import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model()
export class SocialServiceRB extends CommonsRB {

  @property({
    type: 'string',
    required: true,
  })
  socialServiceTypeId: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  institutionName: string | null;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  programManager: string | null;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  programManagerPosition: string | null;

  constructor(data?: Partial<SocialServiceRB>) {
    super(data);
  }
}
