import {getModelSchemaRef} from '@loopback/rest';
import {serviceOpenAPI} from '.';
import {postReportCardStatus} from '../constants';
import {ReportCardPartialAverage, ReportCardSubject} from '../models';

export const postReportCard = {
  description: "Successful POST request of 'Boleta de calificaciones'",
  content: {
    'application/json': {
      schema: {
        title: 'ReportCard POST Response',
        type: 'object',
        properties: {
          service: serviceOpenAPI.service,
          data: {
            type: 'object',
            properties: {
              card: {
                type: 'object',
                properties: {
                  advanceCredits: {
                    type: 'number'
                  },
                  totalCredits: {
                    type: 'number'
                  },
                }
              },
              subjects: {
                type: 'array',
                items: getModelSchemaRef(ReportCardSubject, {
                  title: 'subjects',
                }),
              },
              partialAverages: {
                type: 'array',
                items: getModelSchemaRef(ReportCardPartialAverage, {
                  title: 'partialAverage',
                }),
              }
            },
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
                default: postReportCardStatus,
              },
            },
          },
        },
      },
    },
  },
};
