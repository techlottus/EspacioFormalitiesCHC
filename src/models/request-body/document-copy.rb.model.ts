import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model({settings: {strict: false}})
export class DocumentCopyRB extends CommonsRB {

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: false,
    },
  })
  documentTypeValue: string;

  constructor(data?: Partial<DocumentCopyRB>) {
    super(data);
  }
}
