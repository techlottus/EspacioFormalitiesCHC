import {createStubInstance, expect, sinon} from '@loopback/testlab';
import {STUDY_CERTIFICATE_ROUTE} from '../../../constants';
import {StudyCertificateController} from '../../../controllers';
import {
  AuthorizationService,
  RequestProcedureService,
  StudyCertificateGetService,
  StudyCertificatePostService,
  TransactionNumberService,
  UpdateCollectionsService
} from '../../../services';
import {authHeader, serviceId, serviceName} from '../../mocks/common.mocks';
import {
  studyCertBaCoacalcoResponse,
  studyCertBaHavreResponse,
  studyCertLiResponse,
  studyCertMaResponse,
  totalStudyCertificateArray
} from '../mocks';

describe('StudyCertificateController', () => {
  const authorizationService = createStubInstance(AuthorizationService);
  const updateCollectionsService = createStubInstance(UpdateCollectionsService);
  const studyCertificateGetService = createStubInstance(StudyCertificateGetService);
  const studyCertificatePostService = createStubInstance(StudyCertificatePostService);
  const proceduresService = createStubInstance(RequestProcedureService);
  const transactionNumberService = createStubInstance(TransactionNumberService);
  const controller = new StudyCertificateController(
    authorizationService,
    updateCollectionsService,
    studyCertificateGetService,
    studyCertificatePostService,
    proceduresService,
    transactionNumberService,
  );

  describe(`GET ${STUDY_CERTIFICATE_ROUTE} test`, () => {
    it("academicLevel = BA, campus = Coacalco", async () => {
      // stubs:
      // expects:
      const controllerResponse = await controller.find(
        serviceId,
        serviceName,
        authHeader
      );
      expect(controllerResponse).to.eql(studyCertBaCoacalcoResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        STUDY_CERTIFICATE_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });

    it("academicLevel = BA, campus = Havre", async () => {
      // expects:
      const controllerResponse = await controller.find(
        serviceId,
        serviceName,
        authHeader
      );
      expect(controllerResponse).to.eql(studyCertBaHavreResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        STUDY_CERTIFICATE_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });

    it("academicLevel = LI", async () => {
      // expects:
      const controllerResponse = await controller.find(
        serviceId,
        serviceName,
        authHeader
      );
      expect(controllerResponse).to.eql(studyCertLiResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        STUDY_CERTIFICATE_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });

    it("academicLevel = MA", async () => {
      // expects:
      const controllerResponse = await controller.find(
        serviceId,
        serviceName,
        authHeader
      );
      expect(controllerResponse).to.eql(studyCertMaResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        STUDY_CERTIFICATE_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });

  });
});
