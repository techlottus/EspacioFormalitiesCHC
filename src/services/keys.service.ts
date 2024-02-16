import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {EJECUTIVA, KEYS_COLLECTION_NAME, ONLINE, ULA} from '../constants';
import {KeysRepository} from '../repositories';
import {
  logMethodAccessDebug, logMethodAccessTrace,
  logger,
  noDocFoundError
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class KeysService {
  constructor(
    @repository(KeysRepository)
    protected keysRepository: KeysRepository,
  ) { }

  async fetchKey(
    identifier: string,
    school: string,
    modality?: string
  ): Promise<string> {
    logMethodAccessDebug(this.fetchKey.name);
    let filter: object = {
      identifier,
      school
    };
    if (school === ULA && modality) {
      if (modality === EJECUTIVA) modality = ONLINE;
      filter = {
        identifier,
        school,
        modality
      };
    }
    return this.fetchKeyInDb(filter);
  }

  async fetchKeyWithModalityAndAcrom(
    identifier: string,
    school: string,
    modality: string,
    acrom: string
  ): Promise<string> {
    logMethodAccessDebug(this.fetchKeyWithModalityAndAcrom.name);
    const filter = {
      identifier,
      school,
      modality,
      acrom
    }
    return this.fetchKeyInDb(filter);
  }

  private async fetchKeyInDb(filter: object) {
    logMethodAccessTrace(this.fetchKeyInDb.name);
    const keyDocument = await this.keysRepository.findOne({where: filter});
    if (!keyDocument) throw noDocFoundError(
      KEYS_COLLECTION_NAME,
      filter
    );
    logger.debug(`keyDocument retrieved: ${JSON.stringify(keyDocument)}`);
    const key = keyDocument.key;
    return key;
  }
}
