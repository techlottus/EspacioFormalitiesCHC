import {serviceOpenAPI} from '.';
import {postDocumentLoanOk} from '../constants';

export const postDocumentLoanOpenAPI = {
  description: "Successful request of 'Préstamo de documentos'",
  content: {
    'application/json': {
      schema: {
        title: 'Docuement loan POST Response',
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
                default: postDocumentLoanOk,
              },
            },
          },
        },
      },
    },
  },
};
