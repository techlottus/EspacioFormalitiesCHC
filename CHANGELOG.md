
# Changelog - SchoolServices - ConstHistCert

## [2.3.2] - 2024-02-15

René Alejandro Rivas

### Changed:
- Calendars controller: validation added to set accurate message if some calendar
is not sent

## [2.3.1] - 2024-02-13

René Alejandro Rivas

### Changed:
- Calendar status message improved
- Calendars controller simplified
- Calendars model renamed to 'Calendar'
- Calendars service:
  - CalendarsObject interface added
  - setCalendarsFormat() method removed
  - calendarsResponse() method added
  - setCalendarObject() method added

## [2.3.0] - 2024-01-12

René Alejandro Rivas

### Added:
- `qr-validation.model`
- `qr-validation.repository`
  - saveProcedureData()

### Changed:
- AcademicRecordController now uses saveProcedureData() to save academic record procedure request data.

## [2.2.0] - 2023-10-05

René Alejandro Rivas

### Changed:
- Controllers:
  - ProgramChange:
    - now uses fetchDetailCodeProgramChange() from transactionNumber
    service to fetch detail code
    - now ueses getTransactionNumberWithDetailCode() to fetch trans number
- Interfaces:
  - campusId added to studentData
- Repos:
  - DetailCodes repo: fetchDetailCode() added
- Services:
  - TransNumber:
    - fetchDetailCodeProgramChange() added
    - now fetchDetailCodeProgramChange() and fetchDetailCode() use fetchDetailCode()
    from DetailCodes repo

## [2.1.1] - 2023-09-22

René Alejandro Rivas

- await added to program change ctrl

## [2.1.0] - 2023-09-12

René Alejandro Rivas

### Changed
- Interfaces:
  - AcademicHistoryData: 'semesters' renamed to 'areasData'
  - AreaDataInterface:
    'semesterNumber' renamed to 'areaName' and setted to string
    'semesterAverage' renamed to 'areaAverage'
- Services:
  - AcademicHistoryService:
    - setSemestersArray() renamed to setAreasData()
      - periodsArray renamed to areaNamesArray and now is made up of 'nombreArea'
      - semestersArray renamed to areasDataArray
      - semesterSubjectsArray renamed to areaSubjectsArray
    - setSemesterSubjectsArray() renamed to setAreaSubjectsArray():
      - periodSubjectsArray renamed to areaSubjectsArray
    - setSemesterAverage() renamed to setAreaAverage()
  - AcademicHistory Proxy:
    - nombreArea added to SubjectDataAsInPermissionsService interface


## [2.0.0] - 2023-09-01

René Alejandro Rivas

### Added:
- Services:
  - ProgramChangeService: method added: setProgramChanceServiceProperties()

### Changed:
- Node version updated to 18.17
- Controllers:
  - ProgramChange: now uses ProgramChangeService to set service properties
- Services:
  - AcademicRecordService: general refactor, now uses
  setCommonPropertiesUlaWithDeliveryAndCampus() and
  setCommonPropertiesUtcWithDeliveryAndCampus() from CommonPropertiesService
  to set service properties
  - CommonPropertiesService:
    - methods added:
      - setCommonPropertiesUlaWithDeliveryAndCampus()
      - setCommonPropertiesUtcWithDeliveryAndCampus()
    - now setCommonPropertiesUtc() doesn't set nor delivery nor campus properties
  - ProofOfStudyService:
    - now setProofOfStudyServicePropertiesULA() doesn't use methods from
    AcademicRecordService but from CommonPropertiesService
  - ScholarshipService.
    - UTC case added to the switch inside setScholarshipServiceProperties()
  - StudyCertificateService:
    - now setStudyCertificatePropertiesUtc() uses
    setCommonPropertiesUtcWithDeliveryAndCampus() from CommonPropertiesService
    - now setStudyCertificatePropertiesUla() uses
    setCommonPropertiesUlaWithDeliveryAndCampus() from CommonPropertiesService
    instead of AcademicRecordService
  - UpdateCollectionsService: now uses logNoDocFound() utility
- Utilities:
  - logNoDocFound() added

## [1.53.0] - 2023-08-18

René Alejandro Rivas

### Changed:

- AcademicHistoryService:
  - **bugfix** at setCardData(), totalCredits is setted with creditosTotales
  property
  - setSemesterAverage() added to calculate semester average
  - roundTo() added to round a float number
  - setSemesterAverage() used to set semesterAverage of every semester object in
  semesters array

## [1.52.2] - 2023-08-14

René Alejandro Rivas

### Changed:
- Interfaces:
  - `report-card.interface`: PartialWithNumbersInterface added
- Services:
  - ReportCardService:
    - setfinalAverage() private method added to calculate the final average of a subject

## [1.52.1] - 2023-08-13

René Alejandro Rivas

### Changed:
- ReportCardService: validation for debt added to setPartialAverages()
  if there is a debt, then partialAverage is setted to '*'

## [1.52.0] - 2023-08-12

René Alejandro Rivas

### Changed:
- Controllers:
  - ReportCardController: setPartialAverages() used from ReportCardService to
  set partialAverages data
- Interfaces:
  - `report-card.interface`: PartialAverageInterface added
- Models:
  - `report-card.model`: ReportCardPartialAverage model added
- OpenAPI:
  - `report-card.openAPI`: partialAverages field added
- Services:
  - ReportCardService: setPartialAverages() public method added
  `report-card.proxy.service`: promPn fields moved to PartialsData

## [1.51.0] - 2023-08-11

René Alejandro Rivas

### Added:
- Interfaces:
  - `academic-history.interface`
  - `general.interface`
  - `report-card.interface`
- Models:
  - `academic-history.model` models:
    - HistorySubject
    - HistorySemester
  - `report-card.model` models:
    - ReportCardSubject
    - ReportCardSemester
- OpenAPI:
  - `academic-history.openAPI`
  - `report-card.openAPI`
- Services:
  - AcademicHistoryService, methods added:
    - fetchAcademicHistoryDataFromPermissionsService()
    - setAcademicHistoryServiceURL()
    - validateHistoryServiceResponse()
    - setCardData()
    - setSemestersArray()
    - setSemesterSubjectsArray()
  - ReportCardService, methods added:
    - fetchReportCardDataFromPermissionsService()
    - setReportCardServiceUrl()
    - validateReportCardServiceResponse()
    - setCreditsData()
    - setSubjectsArray()
    - setTotalAbsences()
    - setParcialsArray()
    - checkDebt()
  - `academic-history.proxy.service`, added:
    - SubjectDataAsInPermissionsService
    - HistoryServiceResponse
    - HistoryProxy
    - provider class
  - `report-card.proxy.service`, added:
    - PartialsData
    - ReportCardPermissionsObject
    - ReportCardResponse
    - ReportCardProxy
    - provider class

### Changed:
- Constants:
  - permissions constants added:
    - REPORT_CARD_SERVICE_URL
    - ACADEMIC_HISTORY_SERVICE_URL
- Controllers:
  - AcademicHistoryController now returns academic history data
  - ReportCardController now returns report card data
- Datasouces:
  - permissions datasource, 3 functions added:
    - fetchAcademicHistoryData
    - fetchReportCardData
    - fetchCampusData

### Deleted:
- Interfaces:
  - `salesforce-request-body.interface` moved to ``general.interface``
  - `student-data.interface` moved to ``general.interface``
- Models:
  - `semester.model` not used

## [1.50.0] - 2023-08-08

René Alejandro Rivas

### Added:
- AcademicHistory proxy service added. File is still empty

### Changed:
- Datasource:
  - getCostsOfDetailIds() added to `payments.datasource`
  - URL is now a parameter
- Interceptors:
  - file-size-validation:
    - sizeInMb() added
    - duplicated logs removed
- Models:
  - AcademicLevel:
    - serviceName property renamed to 'identifier'
    - PeriodsLength model added to AcademicLevel models
    - periodsData added as a property
  - `academic-history.rb.model`:
    - ReportCardRB model added that extends AcademicHistoryRB
- Services:
  - CommonPropertiesService:
    - **bugfix** at setCommonServiceProperties_UTC, validation for delivery
    and campus removed
  - ReportCardService:
    - setMaxAbsences() added to fetch maximum number of absences allowed per
    period modality
  - Payments proxy service:
    - URL added to fetchTransactionNumberFromPayments()
  - Costs proxy service:
    - now uses payments datasource instead of costs datasource
    - URL added to getCostsOfDetailIds()
  - Update collections service:
    - modality added as a param to checkUpdateStudyCertificate()
    - modality and school validation added to dateChangedOfStudyCertificate()
    - this is a **bugfix**

### Removed:
- ReportCardRB model (moved to AcademicHistoryRB)
- Costs datasource (not needed, payments datasource used instead)

## [1.49.0] - 2023-08-08

René Alejandro Rivas

### Changed:
- Constants:
  - SF_PROCEDURE_REQUEST_UTEG_URL added to `salesforce.constants`
- Controllers:
  - AcademicHistory:
    - GET endpoint erased
    - POST endpoint's logic removed
  - PhotostaticCopyOfDocument renamed to DocumentCopy
  - ReportCard:
    - GET endpoint erased
    - POST endpoint's logic removed
- Services:
  - AcademicHistory: all logic removed
  - ReportCard: all logic removed
  - Scholarship: bugfix with ReportCard misuse
  - Transaction: fetchDetailCode() added

### Removed:
- Models: (not needed)
  - AcademicHistory
  - ProgramsOptions
  - SemestersResponse
  - SubjectsResponse
- Repositories: (not needed)
  - SubjectsSemesters
- Services: (method moved to transaction service)
  - DetailCode

## [1.48.0] - 2023-08-03

René Alejandro Rivas

### Changed:

- StudyCertificateGetService:
  - fetchRequirementById() method now has 'requirementsArray' as optional
  parameter and fetches array if it's not provided
  - matchDetailIdWithCostsAndStudyCertificates() added. This method matches
  study certificates with detailIds and with the cost of every certificate. It's
  used both for ULA and UTEG brands.
  - UTEG case was added to the select of school and uses
  matchDetailIdWithCostsAndStudyCertificates() to set the array
  - validation for detail ids added to setCertificateWithCostsArrayUtc()
  - methods for ULA now require just modality, not the whole student data
  - studyCertificateArray is no longer a required argument, it's fetched inside
  the method
  - setCertificateWithCostArrayUlaTraditional() now uses
  matchDetailIdWithCostsAndStudyCertificates()

## [1.47.0] - 2023-07-28

René Alejandro Rivas

### Changed:
- Controllers:
  - StudyCertificateUteg controller now consumes study certificate post service
  to set service object that will be sent to salesforce's service
- Interfaces:
  - CertificateServiceFields_UTEG() added to `service-objects-sf-uteg`
- Services:
  - setStudyCertificateServiceProperties_UTEG() added to
  `study-certificate-post.service`

## [1.46.0] - 2023-07-26

René Alejandro Rivas

### Changed:
- Constants:
  - duplicatedTae added
- Controller:
  - DuplicatedTae:
    - two dependencies added: CommonPropertiesServices, RequestProcedureService
    to set service properties and to set the payload that will be sent to
    salesforce's service
  - GoodConduct:
    - now payload to salesforce's service is setted via RequestProcedureService
  - ProofOfStudyUteg:
    - ProofOfStudy service and UpdateCollections service are used to update and
    fetch data for GET endpoint instead of the repositories.
    - proofofStudy service to set service properties
    - request procedure service to set request body to salesforce's service
- Interfaces:
  - ProofOfStudyServiceFieldsUteg added to UTEG interfaces
- Services:
  - Keys service: fetchKeyWithModality() and fetchKey() merged into one single
  method
  - ProofOfStudy service: setProofOfStudyServicePropertiesUteg() added to set
  proofOfStudy UTEG service properties
  - SfCore service: UTEG route added to fetch salesforce's accessToken
  - UpdateCollections service: bugfix at dateChangedOfProofOfStudy() for UTC

## [1.45.0] - 2023-07-25

René Alejandro Rivas

### Changed:
- Controllers:
  - GoodConduct: now uses CommonProperties service to fetch delivery data and to
  set service properties.
- Models:
  - CertificateFiles model placed inside study-certificate.rb.model
  - CommonsRB now includes 'delivery, 'campus' and 'chargeAccepted' as optional
  properties.
- Services:
  - common-properties.service:
    - fetchDeliveryArray() & fetchCampusArray() added
    - at setCommonServicioProperties_UTEG() a validation to add delivery property
    was added
  - studyCertificateGet servicice:
    - validation to not display certificate for level 03 removed, as requested
  - update-collections: logMethodAccessInfo() used in some methods
- Utils
  - logMethodAccessInfo() added

### Deleted:
- AcademicRecord request body deleted, now CommonsRB is used instead
- GoodConduct request body deleted, CommonsRB is used instead


## [1.44.1] - 2023-07-21

René Alejandro Rivas

### Changed:
- Constants: some study certificate identifiers added
- Controllers:
  - StudyCertificate updated with levelCode to fetch requirements array
  - StudyCertificate (uteg):
    - now it uses StudyCertificate service to fetch study certificate array
    and requirements data
- Models:
  - StudyCertificate: CertificateRequirements model completely refactored
- Services:
  - StudyCert get:
    - setRequirementsArray() completely refactored
    - fetchCertRequirementsArray() & fetchRequirementById() added
  - StudyCert post:
    - validations added to optional fields
- Utils:
  - bugfix at undefinedFieldInDoc()


## [1.44.0] - 2023-07-20

René Alejandro Rivas

### Changed:

- Controllers:
  - study-cert, proofOfStudy controllers were organized and structured
  - 'requirements' field was added to study certificate GET V2 response
- Models:
  - files-certificate renamed to certificate-files
  - flags-certificate renamed to certificate-flags. 'certificareRequirements'
  property removed from the model
  - study-certificate:
    - CertificateRequirements model added to study-certificate.model to set all
    properties of the requirements for study certificate
    - now StudyCertificate model extends from CertificateRequirements
- Services:
  - proofOfStudy: bugfix at sendToSedena validation
  - study-certificate-get.service:
    - refactor of setStudyCertFlags() method, modality
    validation was removed and doesn't include certificate requirements
    - setRequirementsObject() method added to handle arrays of requirements for
    all of the different types of certificates

## [1.43.1] - 2023-07-19

Eduardo Izquierdo Rojas

BugFix and correction in consultation of services in QA,
Change class interceptor to just interceptor methods POST's

- src/controllers/academic-record.controller.ts
- src/controllers/admission-certificate.controller.ts
- src/controllers/document-loan.controller.ts
- src/controllers/proof-of-study.controller.ts
- src/controllers/social-service.controller.ts
- src/controllers/study-certificate.controller.ts

Brief change and addition missing properties

- src/interceptors/file-size-validation.interceptor.ts
- src/interfaces/service-objects-sf-uteg.interface.ts
- src/models/request-body/index.ts
- src/services/photostatic-copy-of-document.service.ts
- src/models/request-body/document-loan.rb.model.ts

## [1.43.0] - 2023-07-17

Eduardo Izquierdo Rojas

Brief change in version

- CHANGELOG.md
- package.json
- public/index.html

Implementaion of interceptor to validate size files of request body
when sending request to methods POST´s in controllers

- src/controllers/academic-record.controller.ts
- src/controllers/admission-certificate.controller.ts
- src/controllers/proof-of-study.controller.ts
- src/controllers/social-service.controller.ts
- src/controllers/study-certificate.controller.ts
- src/controllers/document-loan.controller.ts

Addition of constants: PAYLOAD_LIMIT_SIZE and MAX_LIMIT_SIZE
to limit file size, both single and multiple files

- src/constants/sschc.constants.ts

Creation of interceptor 'file-size-validation.interceptor' to validate file size,
What is sent in the request body, main function 'validateSizeOfFile' that allows
obtaining the approximate size of the files converted into a string in base64
and calculating and validating against the maximum file size allowed

consulted documentation:
https://loopback.io/doc/en/lb4/Validation-controller-repo-service-layer.html#add-interceptor-for-validation
https://loopback.io/doc/en/lb4/Interceptor.html

- src/index.ts
- src/interceptors/file-size-validation.interceptor.ts
- src/interceptors/index.ts

## [1.42.0] - 2023-07-14

René Alejandro Rivas

### Added:

- Controllers:
  - duplicated-tae
  - proof-of-study.uteg
- OpenApi:
  - good-conduct

### Changed:

- Constants:
  - routes and messages for proof of study (uteg) and duplicated tae added
- Controllers:
  - open Api updated
- OpenApi
  - openapi documentation added to proof of study and study certificate and commons
- Services:
  - proxy services moved to /src/services/proxy
- Utils:
  - error functions long strings fixed

## [1.41.0] - 2023-07-14

Eduardo Izquierdo rojas

### Changed:

Addition of data dummy in services copyofacademy, documentLon, photostaticCopy

- src/constants/collections.constants.ts
- src/controllers/copy-of-academic-program.controller.ts
- src/controllers/document-loan.controller.ts
- src/controllers/photostatic-copy-of-document.controller.ts

Brief change in version

- CHANGELOG.md
- package.json
- public/index.html

Update index file

- src/models/index.ts

Creation model to opscions photostatic-copy-of-document

- src/models/photostatic-copy-of-document-options.model.ts
- src/models/photostatic-copy-of-document.model.ts

collection update to save dummy data temporarily, 'SS_ReportCardAcademicHistory'

- src/models/programs-options.model.ts
- src/models/semesters-response.model.ts
- src/models/subjects-respose.model.ts
- src/repositories/subjects-semesters.repository.ts
- src/services/academic-history.service.ts
- src/services/photostatic-copy-of-document.service.ts
- src/services/report-card.service.ts
- src/services/update-collections.service.ts

## [1.40.0] - 2023-07-13

René Alejandro Rivas

### Added:

- study-certificate.uteg.controller controller added

### Changed:

- Constants:

  - Study cert UTEG identifiers added
  - Study cert UTEG messages added
  - Study cert UTEG route added

- Models:

  - StudyCertificate model changed to add uteg requirements
  - AcademicRecord request body model changed to set some properties not required
  - Commons request body model changed to set files field not required
  - StudyCertificate request body model changed to set some properties not required

- Services:
  - Academic Record service validation for campus and delivery added
  - Common properties service validation for campus and delivery added

## [1.39.0] - 2023-07-12

René Alejandro Rivas

### Added:

- GoodConduct controller:
  - GET route that returns delivery types
  - POST route that returns ticket number and transaction number

### Changed:

- Constants:
  - identifiers: GOOD_CONDUCT added
  - messages: good conduct status messages added
  - routes: good conduct route added
- Models:
  - general refactor to all of the models of the microservice.
  - All request body models were renamed and moved to /models/request-body
  - The remaining models were fixed by extending Entity or Model classes,
    as neccessary.
  - Some models were just renamed either the class name or the file.
  - As a result of the renaming, controllers, openApi, services and repositories
    had to change.
- Services:
  - authorization: environment check to validate access token

### Changed:

## [1.38.1] - 2023-07-11

Eduardo izquierdo Rojas

Addition of data dummy to services 'AcademicHistory and ReportCard' for
get data of mango DB temporarily, only for test of services

### Changed:

Change in version files

- CHANGELOG.md
- package.json
- public/index.html

Update index files

- src/repositories/index.ts
- src/models/index.ts

brief change in messages

- src/constants/messages.constants.ts

update controllers to query data from mongoDB in endpoints GEt's and POST's

- src/controllers/academic-history.controller.ts
- src/controllers/report-card.controller.ts

update models of request body´s

- src/models/academic-history-request-body.model.ts
- src/models/report-card-request-body.model.ts

update services for functions to query data of mongoDB

- src/services/academic-history.service.ts
- src/services/report-card.service.ts

### Added:

Creation of models and repository only get data dummy of mongodb

- src/models/semestersResponse.model.ts
- src/models/subjectsRespose.model.ts
- src/repositories/subjects-semesters.repository.ts

## [1.38.0] - 2023-06-21

Eduardo izquierdo Rojas

The main generic files have been created, as well as models, messages, constants,
controller routes, swagger documentation, updating files of the new services:

- academic-history
- copy-of-academic-program
- document-loan
- photostatic-copy-of-document
- report-card.controller

### Changed:

change in version files

- CHANGELOG.md
- package.json
- public/index.html

Addition of routes, names, messages, identifiers and name collections
for news services

- src/constants/collections.constants.ts
- src/constants/identifiers.constants.ts
- src/constants/messages.constants.ts
- src/constants/routes.constants.ts

update of index files to interconnect files

- src/controllers/index.ts
- src/interfaces/index.ts
- src/models/index.ts
- src/openAPI/index.ts
- src/repositories/index.ts
- src/services/index.ts

Addition of properties of UTEG temporary for 'test'

- src/services/common-properties.service.ts

Addition of methods to verify and update data for service photostatic-copy-of-document

- src/services/update-collections.service.ts

### Added:

Creation of controllers for new services

- src/controllers/academic-history.controller.ts
- src/controllers/copy-of-academic-program.controller.ts
- src/controllers/document-loan.controller.ts
- src/controllers/photostatic-copy-of-document.controller.ts
- src/controllers/report-card.controller.ts

Creation of interface for data UTEG

- src/interfaces/service-objects-sf-uteg.interface.ts

Creation of models for data query and request body's

- src/models/academic history-request-body.model.ts
- src/models/academic-history.model.ts
- src/models/photostatic-copy-of-document-request-body.model.ts
- src/models/photostatic-copy-of-document.model.ts
- src/models/report-card-request-body.model.ts
- src/models/report-card.model.ts
- src/models/semester.model.ts
- src/models/subject.model.ts

Creation of documnetation swagger of new services an each endpoint
get and post corresponding

- src/openAPI/academic-history.openAPI.ts
- src/openAPI/copy-of-academic-program.controller.openAPI.ts
- src/openAPI/document-loan.openAPI.ts
- src/openAPI/photostatic-copy-of-document.openAPI.ts
- src/openAPI/report-card.openAPI.ts

Creation for repository for service photostatic-copy-of-document

- src/repositories/photostatic-copy-of-document.repository.ts

Creation of services academic-history, photostatic-copy-of-document
report-card.service

- src/services/academic-history.service.ts
- src/services/photostatic-copy-of-document.service.ts
- src/services/report-card.service.ts

## [1.37.0] - 2023-06-21

René Rivas Robles

### Changed:

- index.ts: default value of PAYLOAD_LIMIT_SIZE changed to 6MB
- Identifiers.constants: PROGRAMA_DE_ULA_ID value updated (bug fixed)
- service-objects-sf-ula.identifiers: Field (Cargo_del_responsable\_\_c) added to
  SocialServiceProgramaULAServicioFields_ULA interface
- social-service-request-body.model: property (programManagerPosition) added to
  SocialServiceRequestBody model
- social-services.service: programManagerPosition validation for
  'Programa de la ULA' social service added, Cargo_del_responsable\_\_c field added
  to 'servicio' field property

## [1.36.1] - 2023-06-20

René Rivas Robles

### Changed:

- Models:
  - FilesCertificate model: 'paymentReceipt' removed from the model
  - Link model: relations removed (not needed)
- Services:
  - StudyCertificateGet service: 'paymentReceipt' logic removed

## [1.36.0] - 2023-06-02

René Rivas Robles

### Changed:

- Models:
  - files-certificate: photograph field removed, not needed anymore
- Services:
  - Authorization: oauthNotAvailableMsg constant removed, not used
  - Campus service: validateCampusResponse() method added to validate campus
    service response
  - Costs service: validateCostsResponse() method added to validate costs
    service response
  - RequestProcedure service: validateSfResponse() method added to validate
    salesforce's servicios escolares response
  - StudyCertificate service: levelcode 01 validation to set photograph flag
    removed, not needed anymore
  - TransactionNumber service: validatePaymentsResponse() method added to
    validate payments service response
  - UpdateCollections service: validatePicklistResponse() method added to
    validate picklist service response

## [1.35.2] - 2023-04-18

Eduardo Izquierdo Rojas

Consultation of detail codes for procedures for UANE in endpoints GET's

### Changed:

Addtion of function 'changeSchoolNameByModality' this is change name of school
to 'UTCBYUANE' or 'ULABYUANE' if are the modalities 1T, BO, 1P and school

- src/utils/utilities.ts

Addition of constans ULABYUANE, UTCBYUANE, SCHOOL_SERVICES
for use in collections, 'AcademicLevels' and 'SS_DetailCodes'

- src/constants/identifiers.constants.ts

Implemetation of function changeSchoolNameByModality in the following files:
where the detail codes are consulted

- src/services/proof-of-study.service.ts
- src/services/study-certificate-get.service.ts
- src/services/transaction-number.service.ts

Change in version

- CHANGELOG.md
- package.json
- public/index.html

## [1.35.1] - 2023-03-24

René Rivas Robles

### Changed:

- Services:
  - Long strings refactored in many services
  - Authorization: validationAccess uncommented (fix)
  - ProofOfStudy & StudyCertificate services:
    - for loops changed to forEach() method
    - some variables renamed
    - long string fixed
    - errors handling improved
  - logger service:
    - '0' added to days lower than 10 at the name file

## [1.35.0] - 2023-03-21

René Rivas Robles

### Added:

- Models:
  - AcademicLevel model
- Repositories:
  - AcademicLevel repository
- Services:
  - Calendars: getCalendars() added
  - Scholarship: fetchScholarshipData() added

### Changed:

- Constants:
  - CALENDARS_ROUTE_V1 redefined
- Controllers:
  - CommonPropertiesServices dependency removed for most controllers
  - Calendar: simplified
  - Scholarship: now uses fetchScholarshipData() from Scholarship service
- Models:
  - CalendarFile renamed to Calendar
- Services:
  - CommonPropertiesServices property from most services, turned from protected
    to public, in order to be used inside controllers too.
  - Calendars:
    - validation academicLevels array is now fetched from database, not hardcoded
    - getCalendarsUla(), getCalendarsUtc() & setCalendarsFormat() refactored
  - UpdateCallendars service long strings fixed
- Tests updated

### Deleted:

- Calendar POST endpoint, not needed

## [1.34.1] - 2023-02-21

Eduardo Izquierdo Rojas

### Changed:

Variable correction to query mongodb in calendar service

- src/constants/identifiers.constants.ts
- src/models/calendarFile.model.ts
- src/services/calendars.service.ts

Change in version

- CHANGELOG.md
- package.json
- public/index.html

## [1.34.0] - 2023-02-15

### Added:

Addition of services, datasources and constants for consum campus permissions service

- src/constants/permissions.constants.ts
  - new variable: PERMISSIONS_SERVICE_CAMPUS_URL
- src/datasources/permissions.datasource.ts
- src/services/campus.proxy.service.ts
- src/services/campus.service.ts

### Changed:

Addtion of parame parameter 'authHeader' in checkUpdateProofOfStudy,
checkUpdateStudyCertificate, checkUpdateCampus

- src/controllers/academic-record.controller.ts
- src/controllers/proof-of-study.controller.ts
- src/controllers/study-certificate.controller.ts

Addtion of method 'updateCampusBlended' to get campus of permission service

- src/services/update-collections.service.ts

Change in version

- CHANGELOG.md
- package.json
- public/index.html

## [1.33.0] - 2023-02-09

René Alejandro Rivas

### Added:

- Constants:
  - Study certificate v2 route
  - FLAGS_STUDY_CERT identifier
- Controllers:
  - at `study-certificate.controller`:
    - Version2 of both GET and POST endpoints added to set the new flags that will
      be needed to handle validations of the story 4765
    - GET V2 consumes setStudyCertFlags from `request-procedure.service` to set
      the new flags
- Models:
  - files-certificate
  - flags-certificate
  - link
  - study-certificate: 3 properties added:
    - certificateRequest
    - certificateRequirements
    - masterLevels
- Services:
  - `common-properties.service`: for handling common operations in procedures
  - `request-procedure.service`:
    - setSfRequestBody() added to set the request body that will be sent to Salesforce
  - `study-certificate-get.service`:
    - setStudyCertFlags() added to set the flags of the new validation of story 4765
  - `study-certificate-post.service`
- Utilities:
  - `error-functions.utils` to set common error responses:
    - schoolError() for unhandled school
    - modalityError() for unhandled modality
    - moDocFoundError() when query result is empty
    - missingPropertyError() for missing properties in request body
    - undefinedFieldInDoc() for missing fields in a document
    - costsError() for no detailId cost from costs service

### Changed:

- Controllers:
  - now they use `common-properties.service` to fetch campus and delivery arrays
  - now they use setSfRequestBody() from `request-procedure.service` to set the
    salesforce's request body
  - now detailCode is not fetched inside the controllers but in
    `transaction-number.service`
- Services:
  - now most of them use functions from `error-functions.utils` to handle errors
  - at `academic-record.service`:
    - common methods moved to `common-properties.service`
  - `authorization.service`:
    - ErrorsService added as dependency to handle http errors
    - errors handling improved
  - `sf-core.service`:
    - Errors Service added to handle http errors
  - StudyCertificateService splitted in two services:
    - `study-certificate-get.service`: to handle operations of the GET method
    - `study-certificate-post.service`: to handle operations of the POST method
  - at `transaction-number.service`:
    - now detailCode is fetched, inside getTransactionNumber()
- Tests
  - Unit tests updated
- Utils
  - at `student-data.utils` now modality 'Ejecutiva' is changed by default to 'Online'

### Deleted:

- Error messages not needed anymore
- A lot of repeated code from controllers and services

## [1.32.2] - 2023-02-02

René Alejandro Rivas

### Added:

- Utilities:
  - logMethodAccessDebug(): to log method access at debug level
  - logMethodAccessTrace(): to log method access at trace level
  - schoolErrorMsg(): to set an error message for unhandeled school

### Changed:

- All services now use functions to log method access, every non-proxy service changed
- `costs-service` now use "ErrorsService" to handle exceptions and errors

## [1.32.1] - 2023-02-01

René Alejandro Rivas

### Changed:

- Services:
  - `request-procedure.service` and `transaction-number.service` now use "ErrorsService" to handle errors regarding http communication. If some error happen, they now throw an error inside the service.
- Controllers:
  - Errors regarding fetching 'ticketNumber' and 'transactionNumber' are not handled anymore in the controllers but in the services. Due to this, all controllers changed.
- Tests:
  - academic record unit updated

## [1.32.0] - 2023-01-31

René Alejandro Rivas

### Added:

- `errors.service` to handle errors and create error responses
- fetchPicklist() added to `update-collections.service`

### Changed:

- `update-collections.service`:
  - now all the calls to 'Sf-Picklist' service are performed inside fetchPicklist() method, and if something goes wrong, the error is thrown inside fetchPicklist()
  - Due to this all public methods now return a void response
- Now errors regarding fetching picklist data are not thrown at the controllers but inside `update-collections.service`. Due to this, all controllers changed

## [1.31.2] - 2023-01-30

René Alejandro Rivas

### Added:

- Utils:
  - `set-responses.utils`:
    - errorChcObject() creates error response for SSCHC
    - successfulChcObject() creates successful response for SSCHC
  - `student-data.utils`
    - tokenDecoder() to decode access token (moved from utilities)
    - getStudentData() to create studentData object (moved from utilities)

### Changed:

- All controlers now return successful responses using "successfulChcObject()" from `set-responses.utils`. This reduce lines of code of all controllers.
- `utilities`: tokenDecoder() and getStudentData() moved to new file

### Removed:

- Console logs
- Commented code

## [1.31.1] - 2022-10-25

René Alejandro Rivas

### Changed:

- Errors handling improved at `request-procedure.service`
- Exceptions thrown at:
  - `keys.service`
  - `detail-codes.service`
- detail codes collection name taken from DETAIL_CODES_COLLECTION_NAME constant

## [1.31.0] - 2022-10-24

René Alejandro Rivas

### Changed:

- Improved error handling at the communication with Salesforce ServiciosEscolares service at:
  - services/request-procedure.service.ts
  - services/update-collections.service.ts

## [1.30.1] - 2022-10-13

Eduardo Izquierdo Rojas

### Changed:

Addtion of method GET for request scholarship types

- src/controllers/scholarship.controller.ts

Modification and documetation for endpoint GET

- src/openAPI/scholarship.openAPI.ts

Addtion of methods "updateProofOfStudyTypes", "dateChangedOfScholarship",
"updateTotalStudyCertificateTypes" for service scholarship

- src/services/update-collections.service.ts

Creation of service and methods for set propertties
"setScolarShipServicioProperties_ULA" and "setScholarshipSelect"

- src/services/scholarship.service.ts

Addition of interface

- modified: src/interfaces/service-objects-sf-ula.interface.ts

Addtion of models

- src/models/scholarship-request-body.model.ts
- src/models/scholarship.model.ts

Creation of repository

- src/repositories/scholarship.repository.ts

Addition of messages and cosntants for service scholarshop

- src/constants/collections.constants.ts
- src/constants/identifiers.constants.ts
- src/constants/messages.constants.ts

Addition of imports of files

- src/repositories/index.ts
- src/models/index.ts
- src/repositories/index.ts
- src/services/index.ts
- src/models/index.ts

Brief change in version

- CHANGELOG.md
- package.json
- public/index.html

## [1.30.0] - 2022-10-05

René Alejandro Rivas

### Added:

- PAYLOAD_LIMIT_SIZE environment variable

### Changed:

- at src/index.ts
- Now payload limit size is setted with PAYLOAD_LIMIT_SIZE environment variable
- '13MB' was setted for when PAYLOAD_LIMIT_SIZE variable is not defined

## [1.29.0] - 2022-09-14

René Alejandro Rivas

### Added:

- At `messages.constants` some errors names were added

### Changed:

- Error handling improved at salesforce's communication:
  - At `update-collections.service.ts`:
    - when errors ocurred, now it doesn't throw a 500 HttpError but returns the error
    - controllers now catch that error and return a more detailed answered about the error
  - At `sf-servicios-escolares.proxy.service.ts`:
    - A **name** optional property was added to the SfProcedureResponse interface
  - At `request-procedure.service.ts`:
    - an errorResponse object was added
    - now with every error, the error Response is setted like this:
      - name is defined
      - message is defined
      - error property is setted to **true**
    - now service returns the errorResponse in case of error
    - controllers verify if error is true (in salesforceResponse), and then return a response depending on error name
    - if salesforce response doesn't include a ticket or a message property an UNEXPECTED FORMAT error is thrown
    - if a 404 status Code is catched a ENROLLMENT NUMBER NOT FOUND is thrown
    - if the error could not be parsed a SF COMMUNICATION ERROR is thrown
    - due to this, all controllers changed to adapt to this change and return a detailed response of error
- a "switch" was added to all controllers to handle salesforceResponse's errors
- _parseDate()_ moved from update-collections.service to utilities
- `scholarship-request-body.model` renamed to `commons-request-body.model`
- at `social-service-request-body.model` now model extends from CommonsRequestBody to avoid duplicate code
- at `authorization.service`:
  - validateHeaders() method added to validate headers
  - some logs levels changed from 'debug' to 'trace' to avoid a logs saturation

### Deleted:

- `program-change-request-body.model`:
  - not needed, `commons-request-body.model` used instead

## [1.28.0] - 2022-09-13

Eduardo Izquierdo Rojas

### Added:

Addtion of program change service, addition of recordtype in "SS_Keys" of mongo
and detail code in 'SS_DetailCodes'

- Controllers:
  - src/controllers/program-change.controller.ts
- Constants:
  - identifiers for:
    - src/constants/identifiers.constants.ts
  - messages:
    - src/constants/messages.constants.ts
  - routes:
    - src/constants/routes.constants.ts
- Models:
  - src/models/program-change-request-body.model.ts
- OpenAPI:
  - src/openAPI/change-program.openAPI.ts

## [1.27.0] - 2022-08-25

Alejandro Rivas Robles

### Added:

- SfCoreService class with 2 methods:
  - getSfAccessToken(school)
  - getSfCoreUrl(school) performs a switch to get sfCore URL depending on school

### Changed:

- SfCore datasource: now recieves URL via parameter
- SfCore proxy service: sends URL as a param
- RequestProcedure and UpdateCollections services now consume SfCoreService to fetch Sf access token
- logger.ts: one line refactor to setLogsEmail

## [1.26.0] - 2022-08-16

Alejandro Rivas Robles

### Added:

- Service:
  - DetailCodes Service
- OpenAPI:
  - admission-certificate.openAPI.ts

### Changed:

- Controllers:
  - AcademicRecord: now fetches detailCode with DetailCodes service
  - AdmissionCertificate:
    - connection with AdmissionCertificateService to get admission cert 'servicio' fields added
    - connection with KeysService to fetch recordTypeId added
    - connection with RequestProcedureService to request 'Acta de Admisión' to Salesforce service added
    - connection with PaymentsService to request transactionNumber added
- Services:
  - 'servicio' properties logs added to: academicRecord, proofOfStudy and StudyCertificate services
  - AdmissionCertService: setAdmissionCertificateServicioProperties_ULA() added to set 'servicio' properties
  - KeyService: 'switch' changed to an 'if' statement
  - RequestProcedureService: errors handling improved
  - SocialServicesService: now setSocialServiceServicioPropertiesforUla() uses setCommonServicioProperties_ULA() from AcademicRecordService
- Utils:
  - Logger:
    - Complete refactor of the Logger function. Actually not a function anymore, but a class with static methods.
    - This implies a chance in calling the logger class, in every single file of this API that used the prior logger function.
    - drop use of monthString() utility, instead now it uses the toLocaleString() method of the date object
- Interfaces:
  - AdmissionCertificate_ULA interface added to service-objects-sf-ula.interface.ts
- Models:
  - AdmissionCertRequestBody now extends from ScholarshipRequestBody
- Constants:
  - messages.constants: added:
    - KEY_NOT_FOUND
    - DETAIL_CODE_NOT_FOUND
  - routes:
    - calendar route added
- OpenAPI:
  - commons.openAPI.ts 404 and 503 objects changed to full (complete error) object response
- Tests:
  - academic-record.unit.ts updated

### Deleted:

- calendars.constants.ts (constants moved to messages.constants.ts)
- createId.js (not needed)
- logger-dependencies.ts (not needed)

## [1.25.0] - 2022-08-02

Alejandro Rivas Robles

### Added:

- Controllers:
  - AdmissionCertificate
  - Scholarship
- Constants:
  - identifiers for:
    - admission certificate
    - scholarship
  - messages:
    - postScholarshipStatusOk
  - routes:
    - admission certificate
    - scholarship
- Models:
  - ScholarshipRequestBody
  - AdmissionCertRequestBody
- OpenAPI:
  - scholarship.openAPI.ts
- Services:
  - AdmissionCertificate service (not finished)

### Changed:

- AcademicRecord Service:
  - setCommonServicioProperties_ULA() added to create a service object without delivery and campus fields
  - Acepto_el_Cargo\_\_c setted to true to all ULA procedures requests as it's not requested at requestBody
- Models:
  - AcademicRecordRequestBody model now extends from ScholarshipRequestBody
- Constants:
  - MATRICULA_NOT_FOUND_STATUS message renamed to UNAVAILABLE_OPTION
- Interfaces:
  - AcademicRecordServicioFields_ULA interface renamed to CommonsServicioFields_ULA
- Utilities:
  - tokenDecoder moved from logger-dependencies to utilities (as it's not a logger dependency)
  - tokenDecoder now uses decode method (from jsonwebtoken) instead of verity method
    this to not perform a validation check, and leave the validation to the Oauth service
  - tokenDecoder now logs and throws errors

### Deleted:

- Controllers (not needed):
  - detailCodes
  - keys
  - pos-modal
- Models (not needed):
  - Modalities
- Repositories (not needed):
  - Modalities
- Services
  - setPhoneNumber() method from Academic Record service (not needed)

## [1.24.0] - 2022-07-26

Alejandro Rivas Robles

### Changed:

- name property in SocialService model renamed to identifier
- social service identifiers changed from mongo ids to string identifiers
- now the school switch in 'social service' service is not performed, the same method is used in both schools

### Deleted:

- setSocialServiceGetResponseForUtc() deleted (not needed)

## [1.23.0] - 2022-07-18

Alejandro Rivas Robles

### Changed:

- authorization service now decodes access token to retrieve studentData and returns it
- logger utility now doesn't decode token, just recieves email as param
- all controllers now fetch studentData via authorization service and don't decode token anymore

## [1.22.1] - 2022-07-09

Eduardo Izquierdo Rojas

### Changed:

Correction in varibles of function format() that to created the objects calendars

- src/services/calendars.service.ts

Brief changes of version

- CHANGELOG.md
- package.json
- public/index.html

## [1.22.0] - 2022-07-09

Alejandro Rivas Robles

### Added:

- a rest property to options object at main() at src/index.ts
  This property increases the limit size of request body permited to 3 MB

### Changed:

- logs of request body at academicHelp Service now log the whole requestbody property except for the files array (to improve performance)
- log of requestbody sent to SF don't log files array anymore (to improve performance)

## [1.21.2] - 2022-07-09

Eduardo Izquierdo Rojas

### Changed:

Remove array by creation objects in request GET calendars

- src/controllers/calendars.controller.ts

Brief changes of version

- CHANGELOG.md
- package.json
- public/index.html

## [1.21.1] - 2022-07-07

Eduardo Izquierdo Rojas

### Changed:

Refactor to request calendars of ULA
And validated that is displayed by mount and year

- src/controllers/calendars.controller.ts
- src/models/calendarFile.model.ts
- src/services/calendars.service.ts

Brief changes

- CHANGELOG.md
- package.json
- public/index.html

## [1.21.0] - 2022-06-22

Eduardo Izquierdo Rojas

### Added:

Addition of endpoint 'GET' for request calendars service
and structure necessary, documation OpenAPI as well as
model, repository, constants.

- src/services/calendars.service.ts
- src/controllers/calendars.controller.ts
- src/services/index.ts
- src/constants/calendars.constants.ts
- src/openAPI/calendar.openAPI.ts
- src/repositories/calendarFiles.repository.ts

## [1.20.0] - 2022-06-13

Alejandro Rivas Robles

### Added:

- Constants:
  - modalities identifiers
- Controllers:
  - detail codes controller
  - pos modal controller
  - socialService type validation in POST endpoint
- Services:
  - validateSocialServiceTypeId() added to socialService service
  - studyCertificateWithCostsArrayUtc() & studyCertificateWithCostsArrayUla() added to studyCertificate service
  - switch validation in ProofOfStudy service to switch school and setProofOfStudyServiceProperties_ULA() to set 'servicio' properties
  - switch validation in StudyCertificate service to switch school and setStudyCertificateServiceProperties_ULA()
- Interfaces
  - service-objects-sf-ula.interface.ts

### Changed:

- Controllers
  - modal of proof of study is now fetched via proof of study service
  - total study certificate picklist now is stored and fetched from SS_StudyCertificate collection
- Models:
  - value in ProofOfStudy model from number to string
  - proofOfStudyType param in proof of study request body changed from number to string
  - value in ProcedureCost model from number to string
  - value in StudyCertificate model from number to string
  - value in Campus model from number to string
- Services:
  - fetchUlaApiName() added to keys service
  - getProofOfStudyWithCostsArrayForUtc() & getProofOfStudyWithCostsArrayForUla added to proof of study service to get proof of study arrays with costs for both schools.
  - 'servicio' properties in POST endpoints are now fetch via each controller service
- swagger documentation updated
- Unit tests updated

### Deleted:

- TotalStudyCertificate:
  - model
  - repository
  - collection name
- set-servicio-properties.service.ts (no longer needed)

## [1.19.0] - 2022-06-07

Alejandro Rivas Robles

### Added:

- POST endpoint in socialService controller
- SocialService service:
  - methods for GET and POST endpoint and a switch based on school
- ULA interfaces
- files model
- messages for socialService response
- OpenApi documentation for socialService GET and POST
- Keys controller (for dev purposes only)
- keysService methods:
  - fetchKey()
  - fetchKeyWithModalityAndProcedureId()
  - fetchKeyInDb()

### Changed:

- procedures identifiers moved from salesforce.constants to identifiers.constants

## [1.18.0] - 2022-05-17

Alejandro Rivas Robles

### Added:

- Constants files:
  - identifiers
  - routes
- Social service GET endpoint:
  - model
  - repository
  - controller

## [1.17.0] - 2022-05-13

Alejandro Rivas Robles

### Added:

- Constants:
  - Collections names
  - URL constants for salesforce ULA services

### Changed:

- All controllers now filter their data ingestion with 'school' parameters
- Datasources with a rest connector to salesforce now recieve URL as a parameter
- Proxy services that comunicates with salesforce's datasources now require URL as a parameter
- Key model changed to adjust to business rules and to be scalable
- Key service changed to adapt key model change
- All 'entity' models':
  - Added 'school' as a parameter
  - settings were adjusted to set custom collection name
- Class services changed to apply 'school' filter to querys
- Proof of Study and Study Certificate services refactor to use 'array.find' instead of 'for' iterators
- Status message constants were moved from /openApi to /constants
- Unit tests updated

### Deleted:

## [1.16.0] - 2022-05-10

Alejandro Rivas Robles

### Added:

- Services:
  - ProofOfStudyService
  - StudyCertificateService
  - KeysService
- Utils:
  - logger
  - logger-dependencies
- Models and Repositories for:
  - SchoolServicesDetailCodes
  - SchoolServicesKeys
- StudentData interface

## Changed:

- GET routes for Proof of Study and Study Certificate now use ProofOfStudyService & StudyCertificateService to set data. This way controllers are kept free of business rules.
- Controllers and services now use KeysService to fetch **recordTypeId** and **picklistName** from 'SchoolServicesKeys' collection (instead of using environment variables).
- getStudentData() moved to `utils/utilities.ts`
- logger moved to `utils/utilities.ts`. This way utilites can also use logger and also simplifies exception handling.
- monthString() and tokenDecoder() moved to `utils/logger-dependencies.ts`
- Unit tests updated (50%)
- name functions accessed through "this.name-function.name"

## Deleted:

- tests.js
- models and repositories for (collections refactor):
  - DcProofOfStudy
  - DcStudyCertBa
  - DcStudyCertLic
- EmailForLog2Service (not needed)

## [1.15.2] - 2022-02-25

Alejandro Rivas Robles

### Added:

- 'proof of study' and 'study certificate' unit tests
  - costs arrays mocks
- eslint quality code tests

## Changed:

- SchoolServicesResponse model renamed to SSCHCResponse model
- logMongoURLNotDefined() turned into an async function because of the needed to make a mongo register
- all calls to logMongoURLNotDefined() in 'constants' directory handled with a .catch() method
- all environment variables logged in mongo if not defined

## [1.15.1] - 2022-02-16

Alejandro Rivas Robles

### Changed:

- ENVIRONMENT constant moved from `sschc.constants` file to `env-variables-logger.service` file to avoid circular dependency

### Removed

- setEmail() function from all controllers. It is not necessary. It just needs to be called in `authorization.service`

## [1.15.0] - 2022-02-10

Alejandro Rivas Robles

### Added:

- 'time' and 'environment' parameters to BackLogs model
- getTime() in `utils.ts` to get time as string
- ENVIRONMENT constant

## [1.14.0] - 2022-02-10

Alejandro Rivas Robles

### Added:

- feature to create registers in Mongo when a URL env. var is not defined:
  - `env-variables-logger.service.ts` with logNotDefinedEV() (logs in console) and logMongoURLNotDefined() (register in a Mongodb collection)
  - BackLogs model and a repository

### Changed:

- logMongoURLNotDefined() used to create registers in Mongo when a URL env var is not defined.
- `id-generator.utils.ts` renamed to `utils.ts` to include both createId() and dateString() utilities used in the service

### Removed:

- `logger.service.ts` that was not in use anymore, and to avoid conflict imports with `logger2.service.ts`

## [1.13.1] - 2022-02-09

Alejandro Rivas Robles

### Changed:

- DetailId is now retrieved from request body in **proofOfStudy** and **studyCertificate**

### Removed:

- backup definition ('??' with nullish coalescing operator from URLs and 'record types')
- Methods from `transaction-number.service.ts` (no longer used):
  - getDetailIdProofOfStudy()
  - getDetailIdStudyCertificate()
  - logFatalCampusError()

## [1.13.0] - 2022-02-08

Alejandro Rivas Robles

### Added:

- studyCertificate array response with costs
  - **DcStudyCertBa** model and repository added to studyCertificate controller
  - **DcStudyCertLic** model and repository added to studyCertificate controller
  - -1 to null validation
  - validation fetching studyCertificate collections
- logs in building studyCertificate and proofOfStudy costs array
- URLS logged in microservices communication

### Changed:

- **getDetailIdStudyCertificate()** in `transaction-number.service.ts` is no longer used
- transactionNumber to "number"
  - -1 to null validation
- "PosWithCosts" model renamed to "ProcedureWithCost"
- unit tests updated

## [1.12.0] - 2022-02-04

Alejandro Rivas Robles

### Added:

- Communication with 'paymentb9' service (/getCostDetailCode route) to get the costs of the proofs of study:
  - `costs.datasource.ts`
  - `costs.proxy.service.ts`
  - `costs.service.ts`
  - `dc-pos.repository.ts`: collection of **detail codes** available for all of the proofs of study.
  - `dc-proof-of-study.model.ts`
  - `pos-with-costs.model.ts` model for the array of proofs of study with costs.
- Numeric identifier function generator: `id-generator.utils.ts`. This creates an integer id for every input.

### Changed

- /proofOfStudies with GET method, returns costs in proofOfStudies array. This uses **getCosts()** method from `costs.service.ts`.
- **detailId** parameter now is required in the request body of /proofOfStudies with POST method and method **getDetailIdProofOfStudy()** of `transaction-number.service.ts` is no longer used.
- `update-collections.service.ts`:
  - value now uses **createId()** function of `id-generator.utils.ts` to create the **value** of every object of the school services' picklist.
  - for loops changed to for-of loops because iterator (i) is no longer needed.

## [1.11.0] - 2022-01-26

Eduardo Izquierdo Rojas

### Added:

- "emailForLog2.service" by get email of header
- "logger2.service" by logs with email as identifier

### Changed:

- "logger.service by logger2.service" in each file where it is used,
  controllers:
  academic-record.controller, proof-of-studies.controller, study-certificate.controller
  services:
  authorization.service, update-collections.service, request-procedure.service, set-servicio-fields.service

## [1.10.0] - 2022-01-21

Alejandro Rivas Robles

### Added:

- Communication with 'paymentb9' service to retrieve transactionNumber for a requested procedure:

  - payments datasource
  - payments proxy service
  - transaction-number-service
  - error handling regarding communication with payments service

- Constants files

### Changed:

- getTokenProperties() in `set-servicio-fields.service.ts` now retrives also 'studentId' and 'periodCode' needed to request transactionNumber
- every procedure consumes transaction-number-service to retrieve transactionNumber from payments service
- Custom error responses with custom structure. This is achieved using Response 'in an express way'. Injecting "RestBindings.Http.RESPONSE" in every controller.

## [1.9.0] - 2022-01-04

Alejandro Rivas Robles

### Added:

- parseDate() method in `update-collections.service.ts` to parse a string date and return a date
- `token.ts` constant file

### Changed:

- bug fixed regarding converting string date to date using parseDate() method.
- "AccessTokenSecret" retrieved from token constant file
- AcademicRequestBodyModel now recieves in files parameter an array of FileFields (not nullable, I couldn't make it nullable).
- "Matricula" is now retrieved from access token, it's no longer hardcoded.
- Updates needed to consume Salesforce services version 2.
  - URL constants changed in `constants/environmentVariables.ts`
  - PicklistInterface added, SfPicklistResponse changed in `sf-picklist.proxy.service.ts`

### Removed:

- files parameter validation in request body

## [1.8.1] - 2021-12-20

Alejandro Rivas Robles

### Added:

- studyCertificateType and studyCertificateTotalType validaton

### Changed:

- "files" and "studyCertificateTotalType" fields in request body now accepts null
- Authorization Service:
  - checkAuthorization() renamed to validateAccessToken() and made a private method
  - validateHeaders() renamed to checkAuthorization() and calls validateAccessToken()
  - controllers now just call one method (checkAuthorization()) instead of two.
  - unit test files adapted to the change regarding this changes.

## [1.8.0] - 2021-12-16

Alejandro Rivas Robles

### Added:

- convertDate Service to convert js dates to 'yyyy-mm-dd' strings

### Changed:

- update collections service: updates to Campus collection sets a date using dateString() function
- swagger updated: delivery and campus refactor, titles added

### Removed:

- Campus model doesn't have a default date anymore

## [1.7.0] - 2021-12-11

Alejandro Rivas Robles

### Added:

- Constants directory for handling environment variables.
- typeof error validation in checkAuthorization() of AuthorizationService.
- decodingTokenErrorsHandler() in SetServicioFieldsService.
- openAPI:
  - 404 NotFound documentation added in POST endpoints.
  - 422 UnprocessableEntity (bad RequestBody) documentation added in POST endpoints.

### Changed:

- loggerService not a class anymore (not needed because it has no dependencies). This allowed to simplify all of the application files because now there is no LoggerService dependency injection anywhere.
- openAPI documentation improved.
- no enrollmentNumber (matricula) now throws an 404 (NotFound) instead of 422 (UnprocessableEntity).

## [1.6.0] - 2021-12-05

Alejandro Rivas Robles

### Added:

- Endpoints:
  - post proofOfStudy endpoint
  - post academicRecord endpoint
  - post studyCertificate endpoint
- Services:
  - sf-servicios-escolares: sets communication with "Servicios Escolares - Salesforce" service
  - set-servicio-fields: sets servicio fields in requests to "Servicios Escolares - Salesforce"
  - request-procedure: handles requests to "Servicios Escolares - Salesforce"
- Models:
  - AcademicRecordRequestBody
  - ProofOfStudyRequestBody
  - StudyCertificateRequestBody
  - TotalStudyCertificate
- Interfaces:
  - AcademicRecordServiceFields
  - ProofofStudyServiceFields
  - StudyCertificateServiceFields
  - SfRequestBody

### Changed:

- Update-collections-service:
  - Delivery and StudyCertificate collections made static.
  - TotalStudyCertificate update collection functions added
  - checkDateChanged() and picklistFetchErrorHandler() added
  - more logs
- Authorization service:
  - debug logs (Request headers, method moved from controllers to validateHeaders() method)
  - authenticationErrorHandler() method added.

### Removed:

- Functions related with updating Delivery and StudyCertificate collections.

## [1.5.0] - 2021-11-25

Alejandro Rivas Robles

## Added:

- Model and repository for modalProofOfStudy.
- modal array with description and imageUrl properties to provide modal info to proofOfStudy endpoint
- controllers unit tests (ProofOfStudy, AcademicRecord, StudyCertificate)

## Changed:

- Models for ProofOfStudy, StudyCertificate, Delivery and Campus:
  - "Value" property deleted
  - "code" property renamed to "value"
  - "Label" property to lowercase

## [1.4.0] - 2021-11-22

Alejandro Rivas Robles

### Added:

- Endpint: /schoolServices/api/studyCertificate/v1.
  - Response: This sends study certificate types, delivery types and campus array
  - consumes updateCollectionsService in order to check for updates in collections data
  - Includes logs
  - OpenAPI spec.
- updateCollectionsService. This service checks if any collection needs to be updated

### Changed:

- /deliveryTypes changed for /schoolServices/api/academicRecord/v1
  - now sends not just delivery types but also campus array
  - consumes updateCollectionsService
- /proofOfStudy changed for /schoolServices/api/proofOfStudy/v1
  - now sends not just proof of study types and delivery types but also campus array
  - consumes updateCollectionsService

## [1.3.0] - 2021-11-09

Alejandro Rivas Robles

### Added:

- Endpoint /deliveryTypes
- Endpoint: /proofOfStudy

## [1.2.0] - 2021-11-02

Alejandro Rivas Robles

### Added

- azurepipelines-dev file
- logger service:
  - logs feature in proofs of study endpoint
- campusvirtual-aouth2 datasource
- oauth service:
  - provides communication with oauth2 microservice via campusvirtual-oauth2 datasource
- authentication Service:
  - service id and service name headers validation
  - access token validation via oauth service

### Changed

- .eslintrc to accept "any" as a variable type (necessary for handling errors with oauth service)
- commons.openAPI responses for:
  - badRequest (bad Service-Id or Service-Name header or no accesToken provided)
  - invalid accessToken
  - expiredToken
  - unavailableService (oauth)

## [1.1.0] - 2021-11-02

Alejandro Rivas Robles

### Added

- SchoolServicesConstHistCertApplication
- mongodb-lottus-education.datasource
- .env
  - dotenv package
  - .env file
- Models:
  - school-services-response.model
  - proof-of-studies.model
  - delivery.model
- Repositories:
  - proof-of-study.repository
  - delivery.repository
- proof-of-study.controller
  - /schoolServices/api/proofOfStudy/v1 (GET) endpoint
- OpenAPI:
  - commons.openAPI
  - proof-of-studies.openAPI
- CHANGELOG file
