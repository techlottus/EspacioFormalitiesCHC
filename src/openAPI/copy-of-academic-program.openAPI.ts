import {serviceOpenAPI} from '.';
import {postCopyOfAcademicProgramOk} from '../constants';

export const postCopyOfAcademicProgramOpenAPI = {
  description: "Successful request of 'CCopia de programa académico '",
  content: {
    'application/json': {
      schema: {
        title: 'Copy Of Academic Program POST Response',
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
                default: postCopyOfAcademicProgramOk,
              },
            },
          },
        },
      },
    },
  },
};
