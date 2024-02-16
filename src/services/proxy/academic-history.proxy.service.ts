import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {PermissionsDataSource} from '../../datasources';
import {CampusServiceInterface} from '../../interfaces';

export interface SubjectDataAsInPermissionsService {
  materia: string;
  clave: string;
  plantel: string;
  nivelDesc: string;
  aprobadas: number;
  noAprobadas: number;
  creditosCubiertos: number;
  creditosTotales: number;
  promedioGrado: number;
  promedio: number;
  periodo: string;
  calificacion: number;
  creditos: number;
  tipo: string;
  totalMaterias: number;
  nombreArea: string;
}

interface HistoryServiceResponse {
  service: CampusServiceInterface
  data: SubjectDataAsInPermissionsService[];
}

export interface HistoryProxy {
  fetchAcademicHistoryData(
    authHeader: string,
    serviceId: string,
    permissionsUrl: string,
  ): Promise<HistoryServiceResponse>
}

export class HistoryProxyProvider implements Provider<HistoryProxy> {
  constructor(
    // permissions must match the name property in the datasource json file
    @inject('datasources.permissions')
    protected dataSource: PermissionsDataSource = new PermissionsDataSource(),
  ) { }

  value(): Promise<HistoryProxy> {
    return getService(this.dataSource);
  }
}
