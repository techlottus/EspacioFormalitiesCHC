import {BindingScope, inject, injectable, service} from '@loopback/core';
import {
  ErrorsService,
  HistoryProxy,
  SubjectDataAsInPermissionsService,
} from '.';
import {ACADEMIC_HISTORY_SERVICE_URL, PERMISSIONS_ID} from '../constants';
import {
  AreaDataInterface,
  AreaSubjectInterface,
  HistoryCardInterface,
} from '../interfaces';
import {AcademicHistoryRB} from '../models';
import {
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class AcademicHistoryService {
  constructor(
    @inject('services.HistoryProxy')
    protected historyProxyService: HistoryProxy,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) {}

  async fetchAcademicHistoryDataFromPermissionsService(
    authHeader: string,
    requestBody: AcademicHistoryRB,
  ) {
    logMethodAccessInfo(
      this.fetchAcademicHistoryDataFromPermissionsService.name,
    );
    const historyServiceUrl = this.setAcademicHistoryServiceURL(
      requestBody.programKey,
    );
    let historyArray: SubjectDataAsInPermissionsService[];
    logger.info(
      `Trying to fetch academicHistory data at: ${historyServiceUrl}`,
    );
    try {
      const academicHistoryResponse =
        await this.historyProxyService.fetchAcademicHistoryData(
          authHeader,
          PERMISSIONS_ID,
          historyServiceUrl,
        );
      historyArray = academicHistoryResponse.data;
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        'AcademicHistory data array',
        'Permissions',
      );
    }
    this.validateHistoryServiceResponse(historyArray);
    return historyArray;
  }

  private setAcademicHistoryServiceURL(programKey: string) {
    return ACADEMIC_HISTORY_SERVICE_URL + '?programa=' + programKey;
  }

  private validateHistoryServiceResponse(
    historyArray: SubjectDataAsInPermissionsService[],
  ) {
    logMethodAccessDebug(this.validateHistoryServiceResponse.name);
    if (!historyArray.length)
      throw this.errorsService.setErrorResponse(
        'It was not possible to fetch academic history data',
        'Array fetched from permissions service is empty',
        404,
      );
    logger.info(
      `Permissions service answered successfully with array of ` +
        `${historyArray.length} objects`,
    );
    logger.trace(`Permissions response: ${JSON.stringify(historyArray)}`);
  }

  //////////////////////////////////////////////////////////

  setCardData(subjectObject: SubjectDataAsInPermissionsService) {
    logMethodAccessInfo(this.setCardData.name);
    logger.debug(`First data object: ${JSON.stringify(subjectObject)}`);
    const cardData: HistoryCardInterface = {
      campus: subjectObject.plantel,
      programType: subjectObject.nivelDesc,
      studiedSubjects: subjectObject.aprobadas + subjectObject.noAprobadas,
      totalSubjects: subjectObject.totalMaterias,
      failedSubjects: subjectObject.noAprobadas,
      approvedSubjects: subjectObject.aprobadas,
      advanceCredits: subjectObject.creditosCubiertos,
      totalCredits: subjectObject.creditosTotales,
      totalAverage: subjectObject.promedio,
    };
    logger.info(`Card data setted: ${JSON.stringify(cardData)}`);
    return cardData;
  }

  ////////////////////////////////////////////////////////////////

  setAreasData(
    subjectsAsInPermissionsArray: SubjectDataAsInPermissionsService[],
  ) {
    logMethodAccessDebug(this.setAreasData.name);
    const areaNamesArray = [
      ...new Set(subjectsAsInPermissionsArray.map(obj => obj.nombreArea)),
    ];
    logger.info(`${areaNamesArray.length} areas fetched: ${areaNamesArray}`);
    const areasDataArray: AreaDataInterface[] = [];
    areaNamesArray.forEach(area => {
      // const semesterNumber = areaNamesArray.indexOf(area) + 1;
      // logger.debug("Semester number: " + semesterNumber);
      // FILTER SUBJECTS BY AREA
      const areaSubjectsAsInPermissionsArray =
        subjectsAsInPermissionsArray.filter(obj => obj.nombreArea === area);
      const areaSubjectsArray = this.setAreaSubjectsArray(
        areaSubjectsAsInPermissionsArray,
        area,
      );
      // SET SEMESTER OBJECT
      const areaObject: AreaDataInterface = {
        areaName: area,
        subjects: areaSubjectsArray,
        areaAverage: this.setAreaAverage(areaSubjectsArray),
      };
      areasDataArray.push(areaObject);
    });
    return areasDataArray;
  }

  private setAreaSubjectsArray(
    areaSubjectsPermissionsArray: SubjectDataAsInPermissionsService[],
    area: string,
  ): AreaSubjectInterface[] {
    logMethodAccessDebug(this.setAreaSubjectsArray.name);
    logger.info('Setting subjects array for area: ' + area);
    const areaSubjectsArray: AreaSubjectInterface[] = [];
    areaSubjectsPermissionsArray.forEach(obj => {
      const grade = obj.calificacion;
      const subject: AreaSubjectInterface = {
        subjectKey: obj.clave,
        subjectName: obj.materia,
        evaluationType: obj.tipo,
        grade,
        credits: obj.creditos,
        schoolCycle: obj.periodo,
        failed: grade < 6 ? true : false,
      };
      areaSubjectsArray.push(subject);
    });
    logger.info(`Array of ${areaSubjectsArray.length} subjects setted`);
    return areaSubjectsArray;
  }

  private setAreaAverage(areaSubjectsArray: AreaSubjectInterface[]): number {
    logMethodAccessTrace(this.setAreaAverage.name);
    let sumAreaGrades = 0;
    areaSubjectsArray.forEach(subject => {
      sumAreaGrades += subject.grade;
    });
    const areaAverage = this.roundTo(
      sumAreaGrades / areaSubjectsArray.length,
      2,
    );
    logger.debug('Area average: ' + areaAverage);
    return areaAverage;
  }

  private roundTo(n: number, digits: number) {
    const multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    const test = Math.round(n) / multiplicator;
    return +test.toFixed(digits);
  }
}
