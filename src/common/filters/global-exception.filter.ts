import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    let error: string;
    let details: string | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const errorObj = exceptionResponse as any;
        message = errorObj.message || exception.message;
        error = errorObj.error || 'Http Exception';
        details = errorObj.details;
      } else {
        message = exceptionResponse as string;
        error = 'Http Exception';
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro interno do servidor';
      error = 'Internal Server Error';
      details = exception.message;
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Erro inesperado';
      error = 'Unknown Error';
      details = String(exception);
    }

    this.logger.error(
      `${request.method} ${request.url}`,
      {
        statusCode: status,
        message,
        error,
        details,
        stack: exception instanceof Error ? exception.stack : undefined,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
      },
    );

    const errorResponse = {
      success: false,
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      error,
      ...(details && { details }),
    };

    response.status(status).json(errorResponse);
  }
} 