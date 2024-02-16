import {serviceOpenAPI} from '.';
import {getSocialServiceStatusOk, postSocialServiceStatusOk} from '../constants';

export const getSocialServiceSuccessfulSwagger = {
  description: "Successful GET response to retrieve data for SocialService form",
  content: {
    'application/json': {
      schema: {
        title: 'SocialService GET Response',
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
                default: 200,
              },
              info: {
                type: 'string',
                default: getSocialServiceStatusOk
              }
            }
          },
          data: {
            type: 'object',
            properties: {
              socialServiceTypes: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: {
                      type: 'string'
                    },
                    type: {
                      type: 'string'
                    }
                  }
                }
              },
              filesLinks: {
                type: 'object',
                properties: {
                  registeredInstitutions: {
                    type: 'string'
                  },
                  registrationCompanyFormat: {
                    type: 'string'
                  },
                  socialServiceRequirements: {
                    type: 'string'
                  }
                }
              },
              socialServiceRequirements: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    step: {
                      type: 'number'
                    },
                    title: {
                      type: 'string'
                    },
                    text: {
                      type: 'string'
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export const postSocialServiceSuccessfulSwagger = {
  description: "Successful request of 'Servicio Social' procedure",
  content: {
    'application/json': {
      schema: {
        title: 'SocialService POST Response',
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
                default: postSocialServiceStatusOk
              }
            }
          }
        }
      },
    },
  },
};
