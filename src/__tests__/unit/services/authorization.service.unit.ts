// import {HttpErrors} from '@loopback/rest'
// import {createStubInstance, expect, sinon} from '@loopback/testlab'
// import {invalidToken} from '../../../openAPI'
// import {AuthorizationService, LoggerService, Oauth2} from '../../../services'
// import {authHeader, serviceId, serviceName} from '../../mocks/common.mocks'

// describe('Authorization Service', () => {
//   const loggerService = createStubInstance(LoggerService)
//   // let oauth2Service: Oauth2
//   // let checkAuthorization: sinon.SinonStub
//   // let service: AuthorizationService

//   const oauth2Service = {checkAuthorization: sinon.stub()}
//   const checkAuthorization = oauth2Service.checkAuthorization as sinon.SinonStub;

//   const service = new AuthorizationService(oauth2Service, loggerService)
//   // beforeEach(setEverythingReady)

//   describe('validateHeaders()', () => {
//     it('valid headers', () => {
//       service.validateHeaders(serviceId, serviceName, authHeader)
//     })

//     // this test should fail
//     it.skip('invalid ServiceId', () => {
//       const badServiceIdError = new HttpErrors.BadRequest('Service-Id is not correct');
//       // expect(service.validateHeaders('badServiceId', serviceName, authHeader)).to.be.rejectedWith(badServiceIdError);
//       expect(service.validateHeaders('badServiceId', serviceName, authHeader)).to.be.throw(HttpErrors)
//       // expect(service.validateHeaders('badServiceId', serviceName, authHeader)).to.be.
//       // service.validateHeaders('badServiceId', serviceName, authHeader)
//       sinon.assert.calledWith(loggerService.stubs.log, 'error', 'Service-Id was not correct');
//     });
//   });

//   describe('checkAuthorization() tests', () => {
//     it('valid token should pass', async () => {
//       const validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVuw6kgQWxlamFuZHJvIFJpdmFzIFJvYmxlcyIsImVtYWlsIjoicmljYXJkby5jZXJ2YW50ZXNAZWR1LnV0Yy5teCIsImlhdCI6MTYzNjQ4MTEwMiwiZXhwIjoxNjM2NDgyMDAyfQ.yz8U_pK0krkRJuCAGicYVoT5Ox1AAMuvAP8OTv_RhgkPPP"
//       await service.checkAuthorization(validToken)
//       await service.checkAuthorization('123')
//     })

//     it('invalid accessToken', async () => {
//       const invalidTokenError = new HttpErrors.Unauthorized('Invalid access token')
//       // await service.checkAuthorization('123')
//       checkAuthorization.resolves({authorized: true})
//       expect(await service.checkAuthorization('123')).to.be.eql({hola: 'hla'})

//       // expect(await service.checkAuthorization('123')).to.be.rejectedWith(invalidTokenError)
//     })

//     it('expired access token', () => {
//       const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiUmVuw6kgQWxlamFuZHJvIFJpdmFzIFJvYmxlcyIsImVtYWlsIjoicmljYXJkby5jZXJ2YW50ZXNAZWR1LnV0Yy5teCIsImlhdCI6MTYzNjQ4MDg5NywiZXhwIjoxNjM2NDgxNzk3fQ.IT4QcaxwZ8ZIxBCR45nx3JO9CyEyeNmL485BxFSCzdk"
//       expect(service.checkAuthorization(expiredToken)).to.be.rejected
//     })
//   })

//   // function setEverythingReady() {
//   //   oauth2Service = {checkAuthorization: sinon.stub()}
//   //   checkAuthorization = oauth2Service.checkAuthorization as sinon.SinonStub;

//   //   service = new AuthorizationService(oauth2Service, loggerService)
//   // }
// })
