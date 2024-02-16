import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model()
export class DocumentLoanRB extends CommonsRB {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: false,
    },
  })
  documentName?: string;

  constructor(data?: Partial<DocumentLoanRB>) {
    super(data);
  }
}
