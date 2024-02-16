import {BindingScope, inject, injectable, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {ErrorsService, Payments} from '.';
import {
  PAYMENTS_SERVICE_ID,
  PAYMENTS_SERVICE_NAME,
  PAYMENTS_SERVICE_URL,
  PROGRAM_CHANGE,
  ULA,
  UTC,
} from '../constants';
import {StudentData} from '../interfaces';
import {AcademicLevelsRepository, DetailCodesRepository} from '../repositories';
import {
  changeSchoolNameByModality,
  getStudentData,
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class TransactionNumberService {
  constructor(
    @inject('services.Payments')
    protected paymentsProxy: Payments,
    @repository(AcademicLevelsRepository)
    protected academicLevelsRepository: AcademicLevelsRepository,
    @repository(DetailCodesRepository)
    protected detailCodesRepository: DetailCodesRepository,
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) { }

  // CONSUMES PAYMENTS PROXY SERVICE TO RETRIEVE TRANSACTION NUMBER
  async getTransactionNumber(
    authHeader: string,
    ticketNumber: string,
    procedure: string,
    studentData: StudentData,
  ): Promise<number | null> {
    logMethodAccessDebug(this.getTransactionNumber.name);
    // verify levelcode to change name school to 'UTCBYUANE' or 'ULABYUANE' only levels 1T, BO, !P
    const changedSchool = await changeSchoolNameByModality(
      studentData.levelCode,
      studentData.school,
      this.academicLevelsRepository,
    );
    const detailCode = await this.fetchDetailCode(
      procedure,
      changedSchool,
      studentData.modality,
    );
    return this.getTransactionNumberWithDetailCode(
      authHeader,
      ticketNumber,
      detailCode,
    );
  }

  private async fetchDetailCode(
    procedure: string,
    school: string,
    modality?: string
  ) {
    logMethodAccessDebug(this.fetchDetailCode.name);
    let filter: {} = {procedure, school}
    if (school === ULA) {
      filter = {
        ...filter,
        modality
      }
    }
    return this.detailCodesRepository.fetchDetailCode(filter);
  }

  async fetchDetailCodeProgramChange(
    school: string,
    campusId: string,
    modality?: string
  ) {
    logMethodAccessDebug(this.fetchDetailCodeProgramChange.name);
    if (school !== UTC) {
      return await this.fetchDetailCode(PROGRAM_CHANGE, school, modality);
    } else {
      let filter = {}
      if (campusId === "ZRB") filter = {school, identifier: "UTC"}
      else filter = {school, identifier: "CETC"}
      logger.debug(`campusId: ${campusId}: filter: ${JSON.stringify(filter)}`);
      return await this.detailCodesRepository.fetchDetailCode(filter);
    }
  }

  async getTransactionNumberWithDetailCode(
    authHeader: string,
    ticketNumber: string,
    detailId: string,
  ) {
    logMethodAccessInfo(this.getTransactionNumberWithDetailCode.name);
    const paymentsBody = await this.setPaymentsBody(
      authHeader,
      ticketNumber,
      detailId,
    );
    let transactionNumber: number | null;
    try {
      logger.info(`Trying to request transactionNumber to 'Payments' service ` +
        `for ticketNumber: ${ticketNumber} at ${PAYMENTS_SERVICE_URL}`);
      const paymentsResponse =
        await this.paymentsProxy.fetchTransactionNumberFromPayments(
          authHeader,
          PAYMENTS_SERVICE_ID,
          paymentsBody,
          PAYMENTS_SERVICE_URL!
        );
      logger.debug(`Payments response: ${JSON.stringify(paymentsResponse)}`);
      transactionNumber = paymentsResponse.data?.transactionNumber;
    } catch (err) {
      throw this.errorsService.setHttpErrorResponse(
        err.statusCode,
        err.message,
        'transactionNumber',
        'Payments',
      );
    }
    this.validatePaymentsResponse(transactionNumber);
    if (transactionNumber === -1) transactionNumber = null;
    return transactionNumber;
  }

  // SETS REQUEST BODY TO CONSUME PAYMENTS SERVICE
  private async setPaymentsBody(
    authHeader: string,
    ticketNumber: string,
    detailId: string,
  ) {
    logMethodAccessTrace(this.setPaymentsBody.name);
    const paymentsService = {
      id: PAYMENTS_SERVICE_ID,
      name: PAYMENTS_SERVICE_NAME,
    };
    const {studentId, periodCode} = getStudentData(authHeader);

    const data = {
      userId: studentId,
      ticket: ticketNumber,
      detailId,
      periodCode,
    };
    const paymentsBody = {
      service: paymentsService,
      data,
    };
    logger.debug(`paymentsBody setted: ${JSON.stringify(paymentsBody)}`);
    return paymentsBody;
  }

  private validatePaymentsResponse(transactionNumber: number) {
    logMethodAccessTrace(this.validatePaymentsResponse.name);
    if (!transactionNumber)
      throw this.errorsService.setErrorResponse(
        "Unable to get 'transactionNumber' from Payments service",
        "transactionNumber was not defined from 'Payments' response",
        500
      );
    logger.info(`Payments answered correctly with a transactionNumber: ` +
      `'${transactionNumber}'`);
  }
}
