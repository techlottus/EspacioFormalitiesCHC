import {Model, model, property} from '@loopback/repository';
import {Link} from '.';

@model()
export class CertificateFiles extends Model {
  @property({
    type: 'boolean',
    required: true,
  })
  certificateRequest: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  curp: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  ine: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  academicRecord: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  identityCard: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  bachelorsDegree: boolean;

  constructor(data?: Partial<CertificateFiles>) {
    super(data);
    this.certificateRequest = false;
    this.curp = false;
    this.ine = false;
    this.academicRecord = false;
    this.identityCard = false;
    this.bachelorsDegree = false;
  }
}

@model()
export class CertificateFlags extends Model {

  @property({
    type: 'object',
    required: true,
  })
  certificateRequest: Link;

  @property({
    type: 'CertificateFiles',
    required: true,
  })
  files: CertificateFiles;

  constructor(data?: Partial<CertificateFlags>) {
    super(data);
    this.certificateRequest = new Link();
    this.files = new CertificateFiles();
  }
}
