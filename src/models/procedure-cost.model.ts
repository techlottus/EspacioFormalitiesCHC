import {Model, model, property} from '@loopback/repository';

@model()
export class ProcedureWithCost extends Model {
  @property({
    type: 'string',
    required: true,
  })
  label: string;

  @property({
    type: 'string',
    required: true,
  })
  value: string;

  @property({
    type: 'string',
    required: true,
  })
  detailId: string;

  @property({
    type: 'number',
    required: true,
    jsonSchema: {
      nullable: true
    }
  })
  cost: number | null;

  constructor(data?: Partial<ProcedureWithCost>) {
    super(data);
  }
}
