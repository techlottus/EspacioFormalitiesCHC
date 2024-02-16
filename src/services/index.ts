export * from './env-variables-logger.service';
// Proxy services
export * from './proxy';
// Dependencies
export * from './errors.service';
export * from './common-properties.service';
export * from './keys.service';
export * from './academic-record.service';  // Dependency: common-properties
export * from './costs.service';  // Dependency: errors-service
export * from './sf-core.service'; // Dependency: errors-service
// Class services
export * from './academic-history.service';  // Dependency: common-properties
export * from './admission-certificate.service'; // Dependency: common-properties
export * from './authorization.service';  // Dependency: errors
export * from './calendars.service';
export * from './campus.service';  // Dependency: errors
export * from './document-copy.service'; // Dependency: common-properties
export * from './proof-of-study.service'; // Dependencies:
  // - costs
  // - errors
  // - common-prop
  // - academic-record
export * from './report-card.service'; // Dependencies:
  // common-properties
  // errors
export * from './request-procedure.service'; // dependencies:
  // keys
  // errors
  // sf-core
export * from './scholarship.service'; // dependency: common-properties
export * from './social-services.service'; // Dependency: common-properties
export * from './study-certificate-get.service'; // dependency: costs
export * from './study-certificate-post.service'; // dependencies:
  // common-prop
  // academic-record
export * from './transaction-number.service'; // dependencies:
  // errors
export * from './update-collections.service';
  // keys
  // core
  // errors
  // campus
