import {model, property} from '@loopback/repository';
import {
  PartialAverageInterface, PartialDataInterface, ReportCardSubjectInterface
} from '../interfaces';

@model()
export class ReportCardPartial implements PartialDataInterface {
  @property({
    type: 'number',
  })
  partialNumber: number;

  @property({
    type: 'number',
  })
  grade: number | string;

  @property({
    type: 'number',
  })
  absence: number | string;
}

@model()
export class ReportCardSubject implements ReportCardSubjectInterface {
  @property({
    type: 'string',
  })
  subjectName: string;

  @property({
    type: 'string',
  })
  subjectKey: string;

  @property({
    type: 'number',
  })
  finalAverage: number | string;

  @property({
    type: 'number',
  })
  totalAbsences: number | string;

  @property({
    type: 'boolean',
  })
  failed: boolean;

  @property({
    type: 'boolean',
  })
  absencesAlert: boolean;

  @property({
    type: 'array',
    itemType: ReportCardPartial
  })
  partials: ReportCardPartial[];
}

@model()
export class ReportCardPartialAverage implements PartialAverageInterface {
  @property({
    type: 'number',
  })
  partial: number;
  @property({
    type: 'number',
  })
  partialAverage: number;
}
