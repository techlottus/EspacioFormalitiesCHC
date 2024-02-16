import {serviceOpenAPI} from '.';
import {postAdmissionCertStatusOk} from '../constants';

export const postAdmissionCertOpenAPI = {
  description: "Successful request of 'Acta de Admisión'",
  content: {
    'application/json': {
      schema: {
        title: "Admission Certificate POST Response",
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              ticketNumber: {
                type: 'string'
              },
              transactionNumber: {
                type: 'string'
              }
            }
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
                default: postAdmissionCertStatusOk
              }
            }
          }
        }
      }
    }
  }
}
