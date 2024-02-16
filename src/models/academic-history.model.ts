import {model, property} from '@loopback/repository';
import {AreaDataInterface, AreaSubjectInterface} from '../interfaces';

@model()
export class AreaSubject implements AreaSubjectInterface {
  @property({
    type: 'string',
  })
  subjectKey: string;

  @property({
    type: 'string',
  })
  subjectName: string;

  @property({
    type: 'string',
  })
  evaluationType: string;

  @property({
    type: 'number',
  })
  grade: number | number;

  @property({
    type: 'number',
  })
  credits: number;

  @property({
    type: 'string',
  })
  schoolCycle: string;

  @property({
    type: 'boolean',
  })
  failed: boolean
}

@model()
export class AreaData implements AreaDataInterface {
  @property({
    type: 'string',
  })
  areaName: string;

  @property({
    type: 'number'
  })
  areaAverage: number;

  @property({
    type: 'array',
    itemType: AreaSubject
  })
  subjects: AreaSubject[];
}
