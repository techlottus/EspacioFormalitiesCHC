import {serviceOpenAPI} from '.';
import {postProgramChangeStatusOk} from '../constants';

export const postProgramChangeOpenAPI = {
  description: "Successful request of 'Cambio de programa'",
  content: {
    'application/json': {
      schema: {
        title: 'Program change POST Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              ticketNumber: {
                type: 'string',
              },
              transactionNumber: {
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
                default: postProgramChangeStatusOk,
              },
            },
          },
        },
      },
    },
  },
};
