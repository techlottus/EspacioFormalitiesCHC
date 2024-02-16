import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model()
export class ScholarshipRB extends CommonsRB {

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      nullable: true,
    },
  })
  scholarshipTypeValue?: string;

  constructor(data?: Partial<ScholarshipRB>) {
    super(data);
  }
}
