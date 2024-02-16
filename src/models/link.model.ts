import {model, property} from '@loopback/repository';

@model()
export class Link {
  @property({
    type: 'boolean',
    required: true,
  })
  display: boolean;

  @property({
    type: 'string',
    required: true,
  })
  link: string;

  constructor(data?: Partial<Link>) {
    this.display = false;
  }
}
