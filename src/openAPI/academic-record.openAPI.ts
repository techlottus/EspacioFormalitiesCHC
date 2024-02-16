import {deliveryAndCampus, serviceOpenAPI} from '.';
import {
  getAcademicRecordStatusOk, postAcademicRecordStatusOk
} from '../constants';

export const getAcademicRecordSwagger = {
  description: "Successful GET request to retrieve 'combos' of 'Historial Académico'",
  content: {
    'application/json': {
      schema: {
        title: "AcademicRecord GET Response",
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              ...deliveryAndCampus
            },
          },
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                default: 200
              },
              info: {
                type: 'string',
                default: getAcademicRecordStatusOk
              }
            }
          },
        }
      },
    },
  },
};

export const postAcademicRecordSwagger = {
  description: "Successful request of 'Historial Académico' procedure",
  content: {
    'application/json': {
      schema: {
        title: 'AcademicRecord POST Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              ticketNumber: {
                type: 'string',
                default: '12345678'
              },
              transactionNumber: {
                type: 'string',
                default: '123456'
              }
            },
          },
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                default: 201
              },
              info: {
                type: 'string',
                default: postAcademicRecordStatusOk
              }
            }
          }
        }
      },
    },
  },
};
