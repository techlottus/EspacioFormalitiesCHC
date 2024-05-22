import {BindingScope, inject, injectable, service} from '@loopback/core';
import {
  ErrorsService, PartialsData, ReportCardFromPermissionsObject, ReportCardProxy
} from '.';
import {
  PERMISSIONS_ID,
  REPORT_CARD_SERVICE_URL
} from '../constants';
import {
  CreditsInterface,
  PartialAverageInterface,
  PartialWithNumbersInterface,
  ReportCardSubjectInterface
} from '../interfaces';
import {ReportCardRB} from '../models';
import {
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class ReportCardService {
  constructor(
    @inject('services.ReportCardProxy')
    protected reportCardProxyService: ReportCardProxy,
    @service(ErrorsService)
    protected errorsService: ErrorsService
  ) { }

  private MAX_POSSIBLE_PARTIALS = 5;
  private APPROVED_GRADE = 6;
  private MAX_ABSENCES = 7;

  async fetchReportCardDataFromPermissionsService(
    authHeader: string,
    requestBody: ReportCardRB) {
    logMethodAccessInfo(this.fetchReportCardDataFromPermissionsService.name);
    const reportCardServiceUrl = this.setReportCardServiceUrl(
      requestBody.programKey,
      requestBody.periodValue
    );
    let reportCardArray: ReportCardFromPermissionsObject[];
    logger.info(`Trying to fetch report card data at: ${reportCardServiceUrl}`);
    try {
      const reportCardServiceResponse =
        await this.reportCardProxyService.fetchReportCardData(
          authHeader,
          PERMISSIONS_ID,
          reportCardServiceUrl
        );
      reportCardArray = reportCardServiceResponse.data;
    } catch (err) {
      console.log(err)
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        'ReportCard data array',
        'Permissions',
      );
    }
    this.validateReportCardServiceResponse(reportCardArray);
    return reportCardArray;
  }

  private setReportCardServiceUrl(
    programKey: string,
    periodCode: string,
  ) {
    logMethodAccessTrace(this.setReportCardServiceUrl.name);
    const realProgramKey = programKey.split("-")[0]
    return REPORT_CARD_SERVICE_URL + '?programa=' + realProgramKey +
      '&periodo=' + periodCode;
  }

  private validateReportCardServiceResponse(
    reportCardArray: ReportCardFromPermissionsObject[]
  ) {
    logMethodAccessDebug(this.validateReportCardServiceResponse.name);
    if (!reportCardArray.length)
      throw this.errorsService.setErrorResponse(
        "It was not possible to fetch report card data",
        "Array fetched from permissions service is empty",
        404
      );
    logger.info(`Permissions service answered successfully with array of ` +
      `${reportCardArray.length} objects`);
    logger.trace(
      `Permissions service response: ${JSON.stringify(reportCardArray)}`
    )
  }

  ////////////////////////////////////////////////////////////////

  setCreditsData(reportCardPermissionsObj: ReportCardFromPermissionsObject) {
    logMethodAccessDebug(this.setCreditsData.name);
    logger.debug(`permissions first object: ` +
      `${JSON.stringify(reportCardPermissionsObj)}`)
    const creditsData: CreditsInterface = {
      advanceCredits: reportCardPermissionsObj.creditos,
      totalCredits: reportCardPermissionsObj.creditosTotales
    }
    logger.info(`Credits data: ${JSON.stringify(creditsData)}`);
    return creditsData;
  }

  setSubjectsArray(
    reportCardPermissionsArray: ReportCardFromPermissionsObject[]
  ) {
    logMethodAccessDebug(this.setSubjectsArray.name);
    const subjectsArray: ReportCardSubjectInterface[] = [];
    reportCardPermissionsArray.forEach(subject => {
      logger.info(
        `Creating subject object for '${subject.asignatura}' subject`
      );
      const totalAbsences = this.setTotalAbsences(subject);
      const partialsArray = this.setPartialsArray(subject);
      const finalAverage = this.setfinalAverage(partialsArray);
      let subjectReportCard: ReportCardSubjectInterface = {
        subjectName: subject.asignatura,
        subjectKey: subject.clave,
        finalAverage,
        totalAbsences,
        failed: finalAverage < this.APPROVED_GRADE ? true : false,
        absencesAlert: totalAbsences < this.MAX_ABSENCES ? false : true,
        partials: partialsArray
      }
      subjectReportCard = this.checkDebt(subject.debe, subjectReportCard);
      logger.info("Subject object setted");
      subjectsArray.push(subjectReportCard);
    });
    logger.info("Subjects array setted");
    return subjectsArray;
  }

  private setTotalAbsences(permissionsObj: PartialsData) {
    logMethodAccessTrace(this.setTotalAbsences.name);
    let totalAbsences = permissionsObj.faltasP1;
    for (let i = 2; i <= this.MAX_POSSIBLE_PARTIALS; i++) {
      let key = "faltasP" + i;
      if (key in permissionsObj) {
        totalAbsences += permissionsObj[key as keyof PartialsData]!;
      }
    }
    logger.debug(`Total absences: ${totalAbsences}`);
    return totalAbsences;
  }

  private setPartialsArray(permisionsObj: PartialsData):
    PartialWithNumbersInterface[] {
    logMethodAccessDebug(this.setPartialsArray.name);
    const partialsArray: PartialWithNumbersInterface[] = []
    for (let i = 1; i <= this.MAX_POSSIBLE_PARTIALS; i++) {
      let parcial = "parcial" + i;
      let faltas = "faltasP" + i;
      if (parcial in permisionsObj) {
        const partialObject: PartialWithNumbersInterface = {
          partialNumber: i,
          grade: permisionsObj[parcial as keyof PartialsData]!,
          absence: permisionsObj[faltas as keyof PartialsData]!
        }
        partialsArray.push(partialObject);
      }
    }
    logger.debug(`partialsArray setted: ${JSON.stringify(partialsArray)}`);
    return partialsArray;
  }

  private setfinalAverage(partialsArray: PartialWithNumbersInterface[]) {
    logMethodAccessDebug(this.setfinalAverage.name);
    const totalPartials = partialsArray.length;
    let gradesSum = 0;
    partialsArray.forEach(partial => {
      gradesSum += partial.grade;
    })
    const finalAverage = gradesSum / totalPartials;
    logger.debug(`Grades sum: ${gradesSum}, totalPartials: ${totalPartials}, ` +
      `finalAverage: ${finalAverage}`);
    return finalAverage;
  }

  private checkDebt(
    debt: boolean,
    subjectReportCard: ReportCardSubjectInterface
  ) {
    logMethodAccessDebug(this.checkDebt.name);
    if (debt) {
      logger.info("This user has a debt, grade will not be sent");
      subjectReportCard.finalAverage = '*';
      const totalPartials = subjectReportCard.partials.length;
      for (let i = 0; i < totalPartials; i++) {
        subjectReportCard.partials[i].grade = '*';
      }
    }
    return subjectReportCard;
  }

  setPartialAverages(
    permissionsObj: ReportCardFromPermissionsObject
  ) {
    logMethodAccessDebug(this.setPartialAverages.name);
    const partialAverageArray: PartialAverageInterface[] = [];
    const debt = permissionsObj.debe;
    for (let i = 1; i <= this.MAX_POSSIBLE_PARTIALS; i++) {
      let key = "promP" + i;
      if (key in permissionsObj) {
        const partialAverage = permissionsObj[key as keyof PartialsData]!;
        const partialAverageObj: PartialAverageInterface = {
          partial: i,
          partialAverage: debt ? '*' : partialAverage
        }
        partialAverageArray.push(partialAverageObj);
      }
    }
    logger.debug(
      `Partial averages array setted: ${JSON.stringify(partialAverageArray)}`
    );
    return partialAverageArray;
  }

  // NOT IN USE
  //   private async setMaxAbsences(
  //     periodCode: string,
  //     school: string
  //   ): Promise<number> {
  //     logMethodAccessDebug(this.setMaxAbsences.name);
  //     const filter = {
  //       identifier: PERIOD_LENGTH,
  //       school
  //     }
  //     const periodsDoc = await this.academicLevelsRepo.findOne({where: filter});
  //     if (!periodsDoc)
  //       throw noDocFoundError(ACADEMIC_LEVELS_COLLECTION_NAME, filter);
  //     const periodId = periodCode.slice(-2);
  //     for (let periodsObj of periodsDoc.periodsData!) {
  //       if (periodsObj.periods.includes(periodId)) {
  //         logger.info(`Period type: ${periodsObj.type}`);
  //         logger.info(`Max absences: ${periodsObj.maxAbsences}`);
  //         return periodsObj.maxAbsences;
  //       }
  //     }
  //     throw this.errorsService.setErrorResponse(
  //       "It was not possible to set 'maximum Absences' for this user",
  //       `Period code was not found in ${ACADEMIC_LEVELS_COLLECTION_NAME}`,
  //       404
  //     );
  //   }
}
