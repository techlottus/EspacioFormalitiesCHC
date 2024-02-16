import {getModelSchemaRef} from '@loopback/rest';
import {serviceOpenAPI} from '.';
import {postAcademicHistoryStatus} from '../constants';
import {AreaData} from '../models';

export const academicHistoryPostSwagger = {
  description: "Successful POST request of 'Historia Academica'",
  content: {
    'application/json': {
      schema: {
        title: 'AcademicHistory POST Response',
        type: 'object',
        properties: {
          service: serviceOpenAPI.service,
          data: {
            type: 'object',
            properties: {
              card: {
                type: 'object',
                properties: {
                  campus: {
                    type: 'string'
                  },
                  programType: {
                    type: 'string'
                  },
                  studiedSubjects: {
                    type: 'number'
                  },
                  totalSubjects: {
                    type: 'number'
                  },
                  failedSubjects: {
                    type: 'number'
                  },
                  approvedSubjects: {
                    type: 'number'
                  },
                  advanceCredits: {
                    type: 'number'
                  },
                  totalCredits: {
                    type: 'number'
                  },
                  totalAverage: {
                    type: 'number'
                  }
                }
              },
              semesters: {
                type: 'array',
                items: getModelSchemaRef(AreaData),
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
                default: postAcademicHistoryStatus,
              },
            },
          },
        },
      },
    },
  },
};
