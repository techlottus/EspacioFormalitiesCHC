import {getModelSchemaRef} from '@loopback/rest';
import {serviceOpenAPI} from '.';
import {
  getDocumentCopyOk,
  postDocumentCopyOk,
} from '../constants';
import {CopyOfDocument} from '../models';

export const getDocumentCopySwagger = {
  description: "Successful GET request of 'Copia fotostática de documento'",
  content: {
    'application/json': {
      schema: {
        title: 'Photostatic copy of document GET Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'array',
            items: getModelSchemaRef(CopyOfDocument, {
              title: 'PhotostaticCopyOfDocument',
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
                default: getDocumentCopyOk,
              },
            },
          },
        },
      },
    },
  },
};

export const postDocumentCopySwagger = {
  description: "Successful POST request of 'Copia fotostática de documento'",
  content: {
    'application/json': {
      schema: {
        title: 'Photostatic copy of document POST Response',
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
                default: postDocumentCopyOk,
              },
            },
          },
        },
      },
    },
  },
};
