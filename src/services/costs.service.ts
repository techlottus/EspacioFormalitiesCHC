import {BindingScope, inject, injectable, service} from '@loopback/core';
import {CostObject, CostosBody, Costs, ErrorsService} from '.';
import {
  COSTS_SERVICE_URL, PAYMENTS_SERVICE_ID, PAYMENTS_SERVICE_NAME
} from '../constants';
import {logMethodAccessDebug, logger} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class CostsService {
  constructor(
    @inject('services.Costs')
    protected costsProxy: Costs,
    @service(ErrorsService)
    public errorsService: ErrorsService,
  ) { }

  async getCosts(authHeader: string, detailIdArray: string[]):
    Promise<CostObject[]> {
    logMethodAccessDebug(this.getCosts.name);
    const costsBody: CostosBody = {
      service: {
        id: PAYMENTS_SERVICE_ID,
        name: PAYMENTS_SERVICE_NAME
      },
      data: {
        detailCodes: detailIdArray
      }
    };
    logger.debug(
      `requestBody sent to Costs service: ${JSON.stringify(costsBody)}`
    );
    let costsArray: CostObject[];
    try {
      logger.info(`Trying to get procedures costs from 'paymentb9 service' ` +
        `at ${COSTS_SERVICE_URL}`);
      const costsResponse = await this.costsProxy.getCostsOfDetailIds(
        authHeader,
        PAYMENTS_SERVICE_ID,
        costsBody,
        COSTS_SERVICE_URL!
      );
      costsArray = costsResponse.data;
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        "costs array",
        "Payments"
      )
    }
    this.validateCostsResponse(costsArray);
    return costsArray;
  }

  private validateCostsResponse(costsArray: CostObject[]) {
    if (!costsArray.length)
      throw this.errorsService.setErrorResponse(
        `Costs array couldn't be retrieved from 'paymentsb9' service`,
        "Costs array was empty",
        500
      );
    logger.info(`Costs service answered correctly with costs array: ` +
      `${JSON.stringify(costsArray)}`);
  }
}
