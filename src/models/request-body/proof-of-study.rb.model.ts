import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model()
export class ProofOfStudyRB extends CommonsRB {
  @property({
    type: 'string',
    required: true,
  })
  proofOfStudyType: string;

  @property({
    type: 'boolean',
  })
  sendToSedena?: boolean;

  @property({
    type: 'string',
    required: true
  })
  detailId: string;

  constructor(data?: Partial<ProofOfStudyRB>) {
    super(data);
  }
}
