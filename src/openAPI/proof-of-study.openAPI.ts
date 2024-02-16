import {getModelSchemaRef} from '@loopback/rest';
import {
  commonsUnprocessableEntity, deliveryAndCampus, deliverySwagger, serviceOpenAPI
} from '.';
import {getProofOfStudyStatusOk, postProofOfStudyStatusOk} from '../constants';
import {ProcedureWithCost, ProofOfStudyModal} from '../models';

export const getProofOfStudySwagger = {
  description: "Successful GET request to retrieve 'combos' of 'Constancia de Estudio'",
  content: {
    'application/json': {
      schema: {
        title: "ProofOfStudy GET Response",
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              proofOfStudies: {
                type: 'array',
                items: getModelSchemaRef(ProcedureWithCost, {
                  title: "ProofOfStudyWithCosts",
                }),
              },
              ...deliveryAndCampus,
              modal: {
                type: 'array',
                items: getModelSchemaRef(ProofOfStudyModal, {
                  title: "Modal",
                  exclude: ['id']
                })
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
                default: getProofOfStudyStatusOk
              }
            }
          }
        }
      },
    },
  },
};

export const postProofOfStudySwagger = {
  description: "Successful request of 'Constancia de Estudio' procedure",
  content: {
    'application/json': {
      schema: {
        title: "ProofOfStudy POST Response",
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
                default: postProofOfStudyStatusOk
              }
            }
          }
        }
      },
    },
  },
};

export const unprocessableEntitySedena = {
  description: "UnprocessableEntity Error: Request body validation failed",
  content: {
    'application/json': {
      schema: {
        title: 'UnprocessableEntity',
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
                    message: "must have required property 'sendToSedena'",
                    info: {
                      "missingProperty": "sendToSedena"
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


export const getPoSUtegSwagger = {
  description: "GET request to 'Constancia de Estudio'",
  content: {
    'application/json': {
      schema: {
        title: "ProofOfStudy GET Response",
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
              proofOfStudies: {
                type: 'array',
                items: getModelSchemaRef(ProcedureWithCost, {
                  title: "ProofOfStudyWithCosts",
                }),
              },
              ...deliverySwagger
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
                default: getProofOfStudyStatusOk
              }
            }
          }
        }
      },
    },
  },
};
