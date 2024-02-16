import {Model, model, property} from '@loopback/repository';

@model()
export class SemesterPartial {
  @property({
    type: 'number',
    required: true,
  })
  partialNumber: number;

  @property({
    type: 'string',
    required: true,
  })
  rating: string;

  @property({
    type: 'string',
    required: true,
  })
  absence: string;
}

@model()
export class Subject extends Model {
  @property({
    type: 'string',
    required: true,
  })
  subjectName: string;

  @property({
    type: 'string',
    required: true,
  })
  subjectKey: string;

  @property({
    type: 'number',
    required: true,
  })
  finalAverage: number;

  @property({
    type: 'number',
    required: true,
  })
  totalAbsences: number;

  @property({
    type: 'array',
    itemType: SemesterPartial,
  })
  partials: Array<SemesterPartial>;

  constructor(data?: Partial<Subject>) {
    super(data);
  }
}
