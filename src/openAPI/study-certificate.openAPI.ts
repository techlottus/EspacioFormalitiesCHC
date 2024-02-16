import {getModelSchemaRef} from '@loopback/rest';
import {commonsUnprocessableEntity, deliveryAndCampus, serviceOpenAPI} from '.';
import {getStudyCertUtegStatusOK, getStudyCertificateStatusOk, postStudyCertificateStatusOk} from '../constants';
import {ProcedureWithCost, StudyCertificate} from '../models';

export const getStudyCertificateSwagger = {
  description: "Successful GET request to retrieve 'combos' of 'Certificado de Estudio'",
  content: {
    'application/json': {
      schema: {
        title: 'StudyCertificate GET Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              studyCertificateTypes: {
                type: 'array',
                items: getModelSchemaRef(ProcedureWithCost, {
                  title: "StudyCertificateTypes"
                }),
              },
              studyCertificateTotalTypes: {
                type: 'array',
                items: getModelSchemaRef(StudyCertificate, {
                  title: "StudyCertificateTypes",
                  exclude: ['id', 'date', 'identifier']
                })
              },
              ...deliveryAndCampus
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
                default: getStudyCertificateStatusOk
              }
            }
          }
        }
      },
    },
  },
};

export const postStudyCertificateSwagger = {
  description: "Successful request of 'Certificado de Estudio' procedure",
  content: {
    'application/json': {
      schema: {
        title: 'StudyCertificate POST Response',
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
                default: 200
              },
              info: {
                type: 'string',
                default: postStudyCertificateStatusOk
              }
            }
          }
        }
      },
    },
  },
};

export const unprocessableEntitySC = {
  description: "UnprocessableEntity Error: Request body validation failed",
  content: {
    'application/json': {
      schema: {
        title: "UnprocessableEntity",
        type: 'object',
        properties: {
          error: {
            type: 'object',
            properties: {
              ...commonsUnprocessableEntity,
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  default: {
                    path: "",
                    code: "required",
                    message: "must have required property 'studyCertificateType'",
                    info: {
                      "missingProperty": "studyCertificateType"
                    }
                  },
                }
              }
            }
          }
        }
      }
    }
  }
};

export const getStudyCertUtegSwagger = {
  description: "GET request to 'Certificado de Estudios'",
  content: {
    'application/json': {
      schema: {
        title: 'StudyCertificate GET Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              studyCertificateTypes: {
                type: 'array',
                items: getModelSchemaRef(ProcedureWithCost, {
                  title: "StudyCertificateTypes"
                }),
              },
              requirements: {
                type: 'array',
                items: 'string'
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
                default: getStudyCertUtegStatusOK
              }
            }
          }
        }
      },
    },
  },
};
