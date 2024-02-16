import {model, property} from '@loopback/repository';

@model()
export class Files64 {
  @property({
    type: 'string',
  })
  fileName?: string;

  @property({
    type: 'string',
  })
  fileBody?: string;

  @property({
    type: 'string',
  })
  fileType?: string;
}
