import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PermissionsDataSource} from '../../datasources';
import {CampusServiceInterface} from '../../interfaces';

export interface PartialsData {
  parcial1: number;
  parcial2?: number;
  parcial3?: number;
  parcial4?: number;
  parcial5?: number;
  faltasP1: number;
  faltasP2?: number;
  faltasP3?: number;
  faltasP4?: number;
  faltasP5?: number;
  promP1: number;
  promP2?: number;
  promP3?: number;
  promP4?: number;
  promP5?: number;
}

export interface ReportCardFromPermissionsObject extends PartialsData {
  crn: string;
  matricula: string;
  alumno: string;
  campus: string;
  programa: string;
  ciclo: string;
  bloque: string;
  grupo: string;
  numMat: number;
  clave: string;
  asignatura: string;
  cal: number;
  promCal: number;
  creditos: number;
  creditosTotales: number;
  debe: boolean;
}

export interface ReportCardResponse {
  service: CampusServiceInterface;
  data: ReportCardFromPermissionsObject[]
}

export interface ReportCardProxy {
  fetchReportCardData(
    authHeader: string,
    serviceId: string,
    permissionsUrl: string,
  ): Promise<ReportCardResponse>
}

export class ReportCardProxyProvider implements Provider<ReportCardProxy> {
  constructor(
    // permissions must match the name property in the datasource json file
    @inject('datasources.permissions')
    protected dataSource: PermissionsDataSource = new PermissionsDataSource(),
  ) { }

  value(): Promise<ReportCardProxy> {
    return getService(this.dataSource);
  }
}
