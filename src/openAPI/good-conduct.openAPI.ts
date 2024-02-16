import {deliverySwagger, serviceOpenAPI} from '.';
import {getGoodConductOk} from '../constants';

export const getGoodConductSwagger = {
  description: "Successful GET request to 'Good Conduct'",
  content: {
    'application/json': {
      schema: {
        title: "GoodConduct GET Response",
        type: 'object',
        properties: {
          ...serviceOpenAPI,
          data: {
            type: 'object',
            properties: {
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
                default: getGoodConductOk
              }
            }
          },
        }
      },
    },
  },
};
