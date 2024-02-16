import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model()
export class StudyCertificateRB extends CommonsRB {
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  studyCertificateType: string | null;

  @property({
    type: 'string',
    jsonSchema: {
      nullable: true
    }
  })
  studyCertificateTotalType?: string | null;

  @property({
    type: 'string',
    required: true
  })
  detailId: string;

  constructor(data?: Partial<StudyCertificateRB>) {
    super(data);
  }
}
