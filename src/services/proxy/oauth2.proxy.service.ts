//////////////////// Oauth2 Proxy Service /////////////////
// It's a proxy service
// Handles communication with Oauth2 Microservice via
// campusvirtualOauth2 datasource
///////////////////////////////////////////////////////////

import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {CampusvirtualOauth2DataSource} from '../../datasources';

export interface CheckAuthResponse {
  authorized?: boolean,
  statusCode?: number,
  message?: string,
}

export interface Oauth2 {
  checkAuthorization(accessToken: string, oauthUrl: string): Promise<CheckAuthResponse>
}

export class Oauth2Provider implements Provider<Oauth2> {
  constructor(
    // campusvirtualOauth2 must match the name property in the datasource json file
    @inject('datasources.campusvirtualOauth2')
    protected dataSource: CampusvirtualOauth2DataSource = new CampusvirtualOauth2DataSource(),
  ) { }

  value(): Promise<Oauth2> {
    return getService(this.dataSource);
  }
}
