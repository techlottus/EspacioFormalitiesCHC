import {getModelSchemaRef} from '@loopback/rest';
import {serviceOpenAPI} from '.';
import {calendarsStatusOk} from '../constants';
import {Calendar} from '../models';

export const calendarsResponseSwagger = {
  description: 'Calendars of the institutions successful response',
  content: {
    'application/json': {
      schema: {
        title: 'Calendars response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'array',
            items: getModelSchemaRef(Calendar, {
              title: 'Calendar',
              exclude: ['school'],
            }),
          },
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                default: 200,
              },
              info: {
                type: 'string',
                default: calendarsStatusOk,
              },
            },
          },
        },
      },
    },
  },
};
