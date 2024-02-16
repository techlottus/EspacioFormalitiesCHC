import 'dotenv/config';
import {
  ApplicationConfig,
  SchoolServicesConstHistCertApplication,
} from './application';
import {logger} from './utils';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  options.rest = {
    requestBodyParser: {json: {limit: process.env.MAX_LIMIT_SIZE ?? '5MB'}},
    port: +(process.env.PORT ?? 9091),
    host: process.env.HOST ?? 'localhost',
  };
  const app = new SchoolServicesConstHistCertApplication(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  logger.info(`"${process.env.SERVICE_NAME}" is running at ${url}`);
  logger.info(`Logger level: ${process.env.LOGGER_LEVEL ?? 'debug'}`);
  return app;
}

if (require.main === module) {
  // Run the application
  const config = {
    rest: {
      port: +(process.env.PORT ?? 9091),
      host: process.env.HOST ?? 'localhost',
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
