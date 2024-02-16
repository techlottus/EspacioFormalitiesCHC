import {Entity, model, property} from '@loopback/repository';

@model()
export class BackLogs extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  service: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  variable: string;

  @property({
    type: 'string',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true
  })
  time: string;

  @property({
    type: 'string',
    required: true
  })
  environment: string;

  constructor(data?: Partial<BackLogs>) {
    super(data);
    this.service = "SSCHC"
  }
}
