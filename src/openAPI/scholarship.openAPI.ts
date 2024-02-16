import {getModelSchemaRef} from '@loopback/rest';
import {serviceOpenAPI} from '.';
import {getScholarshipStatusOk, postScholarshipStatusOk} from '../constants';
import {Scholarship} from '../models';

export const getScholarshipSwagger = {
  description: "Successful request of 'Beca'",
  content: {
    'application/json': {
      schema: {
        title: 'Scholarship GET Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'array',
            items: getModelSchemaRef(Scholarship, {
              title: 'Scholarship',
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
                default: getScholarshipStatusOk,
              },
            },
          },
        },
      },
    },
  },
};

export const postScholarshipSwagger = {
  description: "Successful request of 'Beca'",
  content: {
    'application/json': {
      schema: {
        title: 'Scholarship POST Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              ticketNumber: {
                type: 'string',
              },
            },
          },
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                default: 201,
              },
              info: {
                type: 'string',
                default: postScholarshipStatusOk,
              },
            },
          },
        },
      },
    },
  },
};
