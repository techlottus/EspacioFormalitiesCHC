import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  service,
  ValueOrPromise,
} from '@loopback/core';
import {MAX_LIMIT_SIZE, PAYLOAD_LIMIT_SIZE} from '../constants';
import {Files64} from '../models';
import {ErrorsService} from '../services';
import {logger, logMethodAccessTrace} from '../utils';

const bytesinOneMb = 1048576;
const maxSizePerFile = parseInt(PAYLOAD_LIMIT_SIZE!);
const maxPayloadSize = parseInt(MAX_LIMIT_SIZE!);

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: FileSizeValidationInterceptor.BINDING_KEY}})
export class FileSizeValidationInterceptor implements Provider<Interceptor> {
  constructor(
    @service(ErrorsService)
    protected errorsService: ErrorsService,
  ) { }
  static readonly BINDING_KEY = `interceptors.${FileSizeValidationInterceptor.name}`;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      // Add pre-invocation logic here
      logger.debug(`Validating request body files for ` +
        `${invocationCtx.methodName}() of ${invocationCtx.targetClass.name}`
      );

      let totalFilesSize = 0;
      invocationCtx.args[0].files.forEach((file: Files64) => {
        //SIZE VALIDATIONOF EACH FILE
        let fileSize = this.validateSizeOfFile(file.fileBody!, file.fileName!);
        totalFilesSize = totalFilesSize + fileSize;
      });

      // VALIDATE TOTAL FILES SIZE
      if (totalFilesSize > maxPayloadSize) {
        throw this.errorsService.setErrorResponse(
          'Payload too large',
          `The set of files exceeded the maximum allowed size (5MB) ` +
          `with ${this.sizeInMb(totalFilesSize)} MB`,
          413,
        );
      }

      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }

  validateSizeOfFile = (stringBaseB4: string, nameFile: string): number => {
    logMethodAccessTrace('validateSizeOfFile');
    // get the approximate size in bytes of the original file that was encoded
    // https://en.wikipedia.org/wiki/Base64#Padding

    let fileSize = (stringBaseB4.length - 814) / 1.37;
    // validated 1MB max by file
    if (fileSize > maxSizePerFile)
      throw this.errorsService.setErrorResponse(
        'Payload too large',
        `File '${nameFile}' has exceeded maximum size ` +
        `(${this.sizeInMb(maxSizePerFile)} MB) with ` +
        `${this.sizeInMb(fileSize)} MB`,
        413,
      );
    return fileSize;
  };

  sizeInMb(sizeInBytes: number) {
    return (sizeInBytes / bytesinOneMb).toFixed(2);
  }
}
