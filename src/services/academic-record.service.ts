import {BindingScope, injectable, service} from '@loopback/core';
import {CommonPropertiesService} from '.';
import {
  ACADEMIC_RECORD, DIGITAL_ULA_LABEL, DIGITAL_UTC_LABEL, ULA, UTC
} from '../constants';
import {
  CommonServiceFields_ULA, CommonServiceFields_UTC, StudentData
} from '../interfaces';
import {CommonsRB} from '../models';
import {logMethodAccessInfo, logger, schoolError} from '../utils';

@injectable({scope: BindingScope.TRANSIENT})
export class AcademicRecordService {
  constructor(
    @service(CommonPropertiesService)
    public commonPropertiesService: CommonPropertiesService,
  ) { }


  async setAcademicRecordServiceProperties(
    studentData: StudentData,
    requestBody: CommonsRB,
  ) {
    logMethodAccessInfo(this.setAcademicRecordServiceProperties.name);
    let serviceObject: CommonServiceFields_ULA | CommonServiceFields_UTC;
    switch (studentData.school) {
      case ULA:
        return this.commonPropertiesService.
          setCommonPropertiesUlaWithDeliveryAndCampus(
            studentData,
            requestBody,
            ACADEMIC_RECORD
          );
      case UTC:
        return this.commonPropertiesService.
          setCommonPropertiesUtcWithDeliveryAndCampus(
            studentData,
            requestBody,
            ACADEMIC_RECORD
          );
      default:
        throw schoolError(studentData.school);
    }
  }

  private logIfDataWillBeSaved(
    saveProcedureData: boolean,
    deliveryLabel: string
  ) {
    if (saveProcedureData)
      logger.info(
        `Delivery is '${deliveryLabel}', data will be saved for validation`
      );
    else
      logger.info(
        `Delivery is '${deliveryLabel}', data will not be saved for validation`
      );
  }

}
