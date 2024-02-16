import {createStubInstance, expect, sinon} from '@loopback/testlab';
import {PROOF_OF_STUDY_ROUTE} from '../../../constants';
import {ProofOfStudyController} from '../../../controllers';
import {
  AuthorizationService,
  ProofOfStudyService,
  RequestProcedureService,
  TransactionNumberService,
  UpdateCollectionsService
} from '../../../services';
import {
  authHeader,
  serviceId,
  serviceName
} from '../../mocks/common.mocks';
import {proofOfStudyResponse} from '../mocks';

describe('ProofOfStudiesController', () => {
  const authorizationService = createStubInstance(AuthorizationService);
  const updateCollectionsService = createStubInstance(UpdateCollectionsService);
  const proofOfStudyService = createStubInstance(ProofOfStudyService);
  const proceduresService = createStubInstance(RequestProcedureService);
  const transactionNumberService = createStubInstance(TransactionNumberService);
  const controller = new ProofOfStudyController(
    authorizationService,
    updateCollectionsService,
    proofOfStudyService,
    proceduresService,
    transactionNumberService,
  );

  describe(`GET ${PROOF_OF_STUDY_ROUTE} test`, () => {
    it("academicLevel = 'BA'", async () => {
      // expects:
      const controllerResponse = await controller.find(serviceId, serviceName, authHeader);
      expect(controllerResponse).to.eql(proofOfStudyResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        PROOF_OF_STUDY_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });

    it("academicLevel = 'LI'", async () => {
      // expects:
      const controllerResponse = await controller.find(serviceId, serviceName, authHeader);
      expect(controllerResponse).to.eql(proofOfStudyResponse);
      sinon.assert.calledWith(
        authorizationService.stubs.checkAuthorization,
        PROOF_OF_STUDY_ROUTE,
        serviceId,
        serviceName,
        authHeader
      );
    });
  });

  describe(`POST ${PROOF_OF_STUDY_ROUTE} test`, () => {
    it.skip('requestProofOfStudy', async () => {
    })
  });
});
