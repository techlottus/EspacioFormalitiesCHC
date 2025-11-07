import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  CALENDARS,
  CALENDAR_COLLECTION_NAME,
  ULA,
  URL_CALENDAR,
  UTC,
} from '../constants';
import {CalendarsObject} from '../interfaces';
import {Calendar} from '../models';
import {AcademicLevelsRepository, CalendarsRepository} from '../repositories';
import {
  logMethodAccessDebug,
  logMethodAccessInfo,
  logMethodAccessTrace,
  logger,
  noDocFoundError,
  schoolError,
} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class CalendarsService {
  constructor(
    @repository(CalendarsRepository)
    protected calendarsRepository: CalendarsRepository,
    @repository(AcademicLevelsRepository)
    protected academicLevelsRepository: AcademicLevelsRepository,
  ) {}

  async getCalendars(school: string, levelCode: string, periodCode: string) {
    logMethodAccessTrace(this.getCalendars.name);
    switch (school) {
      case UTC:
        return this.getCalendarsUtc(levelCode);
      case ULA:
        return this.getCalendarsUla(levelCode, periodCode);
      default:
        throw schoolError(school);
    }
  }

  private async getCalendarsUla(
    levelCode: string,
    periodCode: string,
  ): Promise<CalendarsObject> {
    logMethodAccessInfo(this.getCalendarsUla.name);
    let calendarsFiltered: Calendar[] = [];

    const levelsFilter = {
      school: ULA,
      identifier: CALENDARS,
    };
    const levelsDoc = await this.academicLevelsRepository.findOne({
      where: levelsFilter,
    });
    if (!levelsDoc) throw noDocFoundError('AcademicLevels', levelsFilter);

    const calendarsFilter = {
      school: ULA,
      selector: URL_CALENDAR,
    };
    const calendarsArray = await this.calendarsRepository.find({
      where: calendarsFilter,
    });

    const levelsOnlineWa = levelsDoc.levels;
    if (levelsOnlineWa.includes(levelCode)) {
      // So modality is online
      logger.debug(
        `Academic level ${levelCode} is included in 'levelsOnlineWa'` +
          ` array, filtering calendars with 'year' field`,
      );
      // VALIDATE SCHOLAR YEAR
      const date = new Date();
      const month = date.getMonth();
      const year = date.getFullYear();
      let scholarYear = year;

      if (month + 1 >= 9) scholarYear = year + 1;
      calendarsFiltered = calendarsArray.filter(
        calendar =>
          calendar.academicLevels.includes(levelCode) &&
          calendar.year == scholarYear,
      );
      if (!calendarsFiltered.length)
        logger.error(
          `No calendars found with level code '${levelCode}' ` +
            `and year '${scholarYear}'`,
        );

      return this.calendarsResponse(calendarsFiltered);
    } else {
      // So modality is: escolarizada
      logger.debug(
        `Academic level ${levelCode} is NOT included in` +
          ` 'levelsOnlineWa' array, filtering calendars with 'period' field`,
      );
      const periodSufix = periodCode.substring(4, 6);
      logger.debug(`Period sufix: ${periodSufix}`);
      calendarsFiltered = calendarsArray.filter(
        calendar =>
          calendar.academicLevels.includes(levelCode) &&
          calendar.periods.includes(periodSufix),
      );
      if (!calendarsFiltered.length)
        logger.error(
          `No calendars found with level code '${levelCode}' ` +
            `and period code '${periodCode}'`,
        );
      return this.calendarsResponse(calendarsFiltered);
    }
  }

  private async getCalendarsUtc(levelCode: string): Promise<CalendarsObject> {
    logMethodAccessInfo(this.getCalendarsUla.name);
    let calendarsFiltered: Calendar[] = [];

    const levelsFilter = {
      school: UTC,
      identifier: CALENDARS,
    };
    const levelsDoc = await this.academicLevelsRepository.findOne({
      where: levelsFilter,
    });
    if (!levelsDoc) throw noDocFoundError('AcademicLevels', levelsFilter);

    const filter = {
      school: UTC,
      selector: URL_CALENDAR,
    };
    const calendarsArray = await this.calendarsRepository.find({
      where: filter,
    });
    if (!calendarsArray.length)
      throw noDocFoundError(CALENDAR_COLLECTION_NAME, filter);

    const levelsOnlineWa = levelsDoc.levels;
    if (levelsOnlineWa.includes(levelCode)) {
      // online
      logger.info(
        `Online calendars have been selected in level:'${levelCode}' `,
      );

      calendarsFiltered = calendarsArray.filter(calendar =>
        calendar.academicLevels.includes(levelCode),
      );

      if (!calendarsFiltered.length)
        logger.error(
          `No calendars found with level code for online levels: '${levelCode}' `,
        );

      return this.calendarsResponse(calendarsFiltered);
    } else {
      // escolarizada
      logger.info(
        `Face to face calendars have been selected in level:'${levelCode}' `,
      );

      calendarsFiltered = calendarsArray.filter(calendar =>
        calendar.academicLevels.includes(levelCode),
      );
      if (!calendarsFiltered.length)
        logger.error(`No calendars found with level code: '${levelCode}' `);

      return this.calendarsResponse(calendarsFiltered);
    }
  }

  private calendarsResponse(calendarsArray: Calendar[]) {
    logMethodAccessDebug(this.calendarsResponse.name);
    return {
      desk: this.setCalendarObject(calendarsArray, 'desktop'),
      mobile: this.setCalendarObject(calendarsArray, 'mobile'),
    };
  }

  private setCalendarObject(calendarsArray: Calendar[], view: string) {
    const calendar = calendarsArray.find(cal => cal.view === view);
    if (!calendar) {
      logger.fatal(`No calendar found for ${view} view`);
      return {};
    }
    const calendarObject = {
      name: calendar.name,
      urlImageCalendar: calendar.urlImageCalendar ?? null,
      urlImageSymbol: calendar.urlImageSymbol ?? null,
      urlPdf: calendar.urlPdf ?? null,
    };
    logger.info(`Calendar object setted for '${view}' view`);
    return calendarObject;
  }
}
