import {getModelSchemaRef} from '@loopback/rest';
import {SERVICE_ID, SERVICE_NAME, } from '../constants';
import {Campus, Delivery} from '../models';

export const serviceOpenAPI = {
  service: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        default: SERVICE_ID
      },
      name: {
        type: 'string',
        default: SERVICE_NAME
      }
    }
  },
};

export const deliverySwagger = {
  delivery: {
    type: 'array',
    items: getModelSchemaRef(Delivery, {
      title: "Delivery",
      exclude: ['_id']
    })
  }
}

export const deliveryAndCampus = {
  ...deliverySwagger,
  campus: {
    type: 'array',
    items: getModelSchemaRef(Campus, {
      title: "Campus",
      exclude: ['_id', 'date']
    })
  }
}

export const commonsUnprocessableEntity = {
  statusCode: {
    type: 'number',
    default: 422
  },
  name: {
    type: 'string',
    default: "UnprocessableEntityError"
  },
  message: {
    type: 'string',
    default: "The request body is invalid. See error object `details` property for more info."
  },
  code: {
    type: 'string',
    default: "VALIDATION_FAILED"
  }
}

export const badRequest = {
  description: "BadRequest Error: Wrong Service-Id or Service-Name or no accessToken provided.",
  content: {
    'application/json': {
      schema: {
        title: "BadRequestError",
        type: "object",
        properties: {
          error: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
                default: 400
              },
              name: {
                type: 'string',
                default: "BadRequestError"
              },
              message: {
                type: 'string',
                default: 'You must provide an authorization token'
              }
            }
          }
        }
      }
    }
  }
};

export const invalidToken = {
  description: "Unauthorized Error: Invalid accessToken.",
  content: {
    'application/json': {
      schema: {
        title: "UnauthorizedError",
        type: "object",
        properties: {
          error: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
                default: 401
              },
              name: {
                type: 'string',
                default: "UnauthorizedError"
              },
              message: {
                type: 'string',
                default: "Invalid access token"
              }
            }
          }
        }
      }
    }
  }
};

export const expiredToken = {
  description: "Forbidden Error: Expired accessToken.",
  content: {
    'application/json': {
      schema: {
        title: "ForbiddenError",
        type: "object",
        properties: {
          error: {
            type: 'object',
            properties: {
              statusCode: {
                type: 'number',
                default: 403
              },
              name: {
                type: 'string',
                default: "ForbiddenError"
              },
              message: {
                type: 'string',
                default: "Access token has expired"
              }
            }
          }
        }
      }
    }
  }
};

export const notFoundError = {
  description: "NotFound Error: enrollmentNumber (matrícula) not found in Salesforce service.",
  content: {
    'application/json': {
      schema: {
        title: "NotFoundError",
        type: "object",
        properties: {
          ...serviceOpenAPI,
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              info: {
                type: 'string',
              }
            }
          },
          error: {
            type: "object",
            properties: {
              id: {
                type: 'number',
                default: 404
              },
              info: {
                type: 'string',
                default: "No se encontró la matrícula '12345' en Salesforce"
              }
            }
          }
        }
      }
    }
  }
};

export const unavailableService = {
  description: "Unavailable service: Some service (Oauth, Salesforce) not available.",
  content: {
    'application/json': {
      schema: {
        title: "UnavailableService",
        type: "object",
        properties: {
          ...serviceOpenAPI,
          status: {
            type: 'object',
            properties: {
              id: {
                type: 'number',
              },
              info: {
                type: 'string',
              }
            }
          },
          error: {
            type: "object",
            properties: {
              id: {
                type: 'number',
                default: 503
              },
              info: {
                type: 'string',
              }
            }
          }
        }
      }
    }
  }
};

export const unprocessableEntityAdditionalProps = {
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
                    code: "additionalProperties",
                    message: "must NOT have additional properties",
                    info: {
                      "missingProperty": "chargeAccepted"
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

export const unprocessableEntityChA = {
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
                    message: "must have required property 'chargeAccepted'",
                    info: {
                      "missingProperty": "chargeAccepted"
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

export const commonPostSwagger = {
  description: "Successful request of procedure",
  content: {
    'application/json': {
      schema: {
        title: 'POST Response',
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
                default: "'procedure' requested successfully to Salesforce service"
              }
            }
          }
        }
      },
    },
  },
};
