import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

export interface Response<T> {
  success: boolean;
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode: response.statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message: this.getSuccessMessage(request.method),
        data: data,
      })),
    );
  }

  private getSuccessMessage(method: string): string {
    switch (method) {
      case 'POST':
        return 'Recurso criado com sucesso';
      case 'PUT':
      case 'PATCH':
        return 'Recurso atualizado com sucesso';
      case 'DELETE':
        return 'Recurso removido com sucesso';
      case 'GET':
      default:
        return 'Operação realizada com sucesso';
    }
  }
} 