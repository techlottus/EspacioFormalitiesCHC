import {Model, model, property} from '@loopback/repository';

@model()
export class AcademicHistoryRB extends Model {
  @property({
    type: 'string',
    required: true,
  })
  programKey: string;

  constructor(data?: Partial<AcademicHistoryRB>) {
    super(data);
  }
}


@model()
export class ReportCardRB extends AcademicHistoryRB {

  @property({
    type: 'string',
    required: true,
  })
  periodValue: string;

  constructor(data?: Partial<ReportCardRB>) {
    super(data);
  }
}
