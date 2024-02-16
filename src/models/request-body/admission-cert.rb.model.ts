import {model, property} from '@loopback/repository';
import {CommonsRB} from '.';

@model()
export class AdmissionCertRequestBody extends CommonsRB {

  @property({
    type: 'string',
    required: true,
  })
  countryOfBirth: string;

  @property({
    type: 'string',
    required: true,
  })
  countryOfPriorStudies: string;

  @property({
    type: 'string',
    required: true,
  })
  schoolOfOrigin: string;

  @property({
    type: 'string',
    required: true
  })
  dateStudiesStarted: string;

  @property({
    type: 'string',
    required: true
  })
  dateStudiesFinished: string;

  constructor(data?: Partial<AdmissionCertRequestBody>) {
    super(data);
  }

}
