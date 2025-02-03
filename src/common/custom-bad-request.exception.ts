import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class CustomBadRequestException implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errors: { [key: string]: string[] } = {};

    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      const validationErrors = exceptionResponse['message'];

      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((message: string) => {
          const field = message.split(' ').shift() ?? 'root';

          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(message);
        });
      }
    }

    response.status(status).json({
      statusCode: status,
      message: 'Bad Request',
      errors,
    });
  }
}
