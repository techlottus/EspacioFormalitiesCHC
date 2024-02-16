import {Entity, Model, model, property} from '@loopback/repository';

@model()
export class PeriodsLength extends Model {
  @property({
    type: 'string'
  })
  type: string;

  @property({
    type: 'array',
    itemType: 'string'
  })
  periods: string[];

  @property({
    type: 'number'
  })
  maxAbsences: number;
}

@model()
export class AcademicLevels extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  identifier: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  levels: string[];

  @property({
    type: 'string',
  })
  school: string;

  @property({
    type: 'array',
    itemType: PeriodsLength
  })
  periodsData?: PeriodsLength[];

  constructor(data?: Partial<AcademicLevels>) {
    super(data);
  }
}
