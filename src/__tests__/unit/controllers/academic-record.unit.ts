import {Response} from '@loopback/rest';
import {createStubInstance, expect, sinon} from '@loopback/testlab';
import {ACADEMIC_RECORD_ROUTE} from '../../../constants';
import {AcademicRecordController} from '../../../controllers';
import {
  AcademicRecordService,
  AuthorizationService,
  RequestProcedureService,
  TransactionNumberService,
  UpdateCollectionsService
} from '../../../services';
import {authHeader, serviceId, serviceName} from '../../mocks/common.mocks';
import {
  academicRecordRequestBody,
  academicRecordResponse,
  postAcademicRecordResponseMock,
  servicioFields,
  ticketNumberDummy,
  transNumberDummy
} from '../mocks';
import {QrValidationRepository} from '../../../repositories';

describe('AcademicRecordController', () => {
  const authorizationService = createStubInstance(AuthorizationService);
  const updateCollectionsService = createStubInstance(UpdateCollectionsService);
  const academicRecordService = createStubInstance(AcademicRecordService);
  const proceduresService = createStubInstance(RequestProcedureService);
  const transactionNumberService = createStubInstance(TransactionNumberService);
  const qrRepository = createStubInstance(QrValidationRepository);
  let res: Response
  const controller = new AcademicRecordController(
    authorizationService,
    updateCollectionsService,
    academicRecordService,
    proceduresService,
    transactionNumberService,
    qrRepository
  );

  describe(`GET ${ACADEMIC_RECORD_ROUTE} test`, () => {
    it('returns arrays of delivery types and campus', async () => {
      // expects:
      const controllerResponse = await controller.find(
        serviceId, serviceName, authHeader
      );
      expect(controllerResponse).to.eql(academicRecordResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        ACADEMIC_RECORD_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });
  });

  describe(`POST ${ACADEMIC_RECORD_ROUTE} test`, () => {
    it('returns arrays of delivery types and campus', async () => {
      // stubs:
      academicRecordService.stubs.setAcademicRecordServiceProperties.resolves(
        {serviceObject: servicioFields, saveProcedureData: true}
      );
      proceduresService.stubs.requestProcedure.resolves(
        ticketNumberDummy
      );
      transactionNumberService.stubs.getTransactionNumber.resolves(
        transNumberDummy
      );
      // expects:
      const controllerResponse = await controller.requestAcademicRecord(
        academicRecordRequestBody,
        serviceId,
        serviceName,
        authHeader
      );
      expect(controllerResponse).to.eql(postAcademicRecordResponseMock);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        ACADEMIC_RECORD_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });
  });
});
