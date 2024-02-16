import {BindingScope, injectable, service} from '@loopback/core';
import {CommonPropertiesService} from '.';
import {ACADEMIC_RECORD, ULA, UTC} from '../constants';
import {StudentData} from '../interfaces';
import {CommonsRB} from '../models';
import {logMethodAccessInfo, schoolError} from '../utils';

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
}
