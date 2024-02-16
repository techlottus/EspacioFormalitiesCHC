import {Model, model, property} from '@loopback/repository';
import {SERVICE_ID, SERVICE_NAME} from '../constants';

@model()
export class SSCHCResponse extends Model {
  @property({
    type: 'object',
    required: true,
  })
  service: object;

  @property({
    type: 'object',
    required: true,
  })
  status: object;

  @property({
    type: 'object',
    required: true,
  })
  error: object;

  @property({
    type: 'object',
  })
  partialResponse?: object;

  @property({
    type: 'object',
    required: true,
  })
  data: object;


  constructor(data?: Partial<SSCHCResponse>) {
    super(data);
    this.service = {
      id: SERVICE_ID,
      name: SERVICE_NAME
    };
  }
}
