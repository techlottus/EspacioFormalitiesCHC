import {Entity, model, property} from '@loopback/repository';
import {STUDY_CERTIFICATE_COLLECTION_NAME} from '../constants';

@model()
export class CertificateRequirements {
  @property({
    type: 'string',
    hidden: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  title: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  body: string[];

  @property({
    type: 'string',
  })
  subtitle?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  secondBody?: string[];
}

@model({
  settings: {
    mongodb: {collection: STUDY_CERTIFICATE_COLLECTION_NAME}
  }
})
export class StudyCertificate extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    hidden: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  label?: string;

  @property({
    type: 'string',
    required: true,
  })
  value?: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  school?: string;

  @property({
    type: 'string',
    required: true,
    hidden: true,
  })
  identifier: string;

  @property({
    type: 'Date',
    default: new Date(),
    hidden: true,
  })
  date?: Date;

  @property({
    type: 'string'
  })
  certificateRequest?: string;

  @property({
    type: 'array',
    itemType: CertificateRequirements
  })
  requirements?: CertificateRequirements[];

  constructor(data?: Partial<StudyCertificate>) {
    super(data);
  }
}
