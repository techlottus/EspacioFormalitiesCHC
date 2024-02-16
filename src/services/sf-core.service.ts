import {BindingScope, inject, injectable, service} from '@loopback/core';
import {ErrorsService, SfCore} from '.';
import {SF_CORE_URL, ULA, UTC, UTEG} from '../constants';
import {
  logger, logMethodAccessDebug, logMethodAccessTrace, schoolError
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class SfCoreService {
  constructor(
    @inject('services.SfCore')
    protected sfCore: SfCore,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) { }

  async getSfAccessToken(school: string): Promise<string> {
    logMethodAccessDebug(this.getSfAccessToken.name);
    try {
      const sfCoreUrl = this.getSfCoreUrl(school);
      logger.debug(`Trying to fetch sf access token at: '${sfCoreUrl}'`);
      const coreSfResp = await this.sfCore.getSfAccessToken(sfCoreUrl);
      const {sfData} = coreSfResp;
      const sfAuthHeader = sfData.tokenType + ' ' + sfData.accessToken;
      logger.info('Salesforce accessToken fetched');
      logger.trace(`sfAccessToken: ${sfAuthHeader}`);
      return sfAuthHeader;
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        'Salesforce access token',
        'Salesforce Core'
      )
    }
  }

  private getSfCoreUrl(school: string) {
    logMethodAccessTrace(this.getSfCoreUrl.name);
    switch (school) {
      case UTC:
        return SF_CORE_URL + '/UTC';
      case ULA:
        return SF_CORE_URL + '/ULA';
      case UTEG:
        return SF_CORE_URL + '/UTEG';
      default:
        throw schoolError(school);
    }
  }
}
