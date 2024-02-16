import {BindingScope, injectable, service} from '@loopback/core';
import {StudentData} from '../interfaces';
import {CommonsRB} from '../models';
import {logMethodAccessInfo, schoolError} from '../utils';
import {CommonPropertiesService} from '.';
import {PROGRAM_CHANGE, ULA, UTC} from '../constants';

@injectable({scope: BindingScope.TRANSIENT})
export class ProgramChangeService {
  constructor(
    @service(CommonPropertiesService)
    protected commonPropertiesService: CommonPropertiesService,

  ) { }

  async setProgramChanceServiceProperties(
    studentData: StudentData,
    requestBody: CommonsRB
  ) {
    logMethodAccessInfo(this.setProgramChanceServiceProperties.name);
    switch (studentData.school) {
      case UTC:
        return this.commonPropertiesService.setCommonPropertiesUtc(
          studentData,
          requestBody,
          PROGRAM_CHANGE
        );
      case ULA:
        return this.commonPropertiesService.setCommonPropertiesUla(
          studentData,
          requestBody,
          PROGRAM_CHANGE
        );
      default:
        throw schoolError(studentData.school);
    }
  }
}
