import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(identifier: string) {
    super(
      {
        message: `Usuário não encontrado`,
        error: 'User Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        details: `Usuário com identificador '${identifier}' não foi encontrado`,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: `Usuário já existe`,
        error: 'User Already Exists',
        statusCode: HttpStatus.CONFLICT,
        details: `Usuário com email '${email}' já está cadastrado`,
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class DatabaseConnectionException extends HttpException {
  constructor(operation: string) {
    super(
      {
        message: `Erro de conexão com o banco de dados`,
        error: 'Database Connection Error',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        details: `Falha ao executar operação: ${operation}`,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class InvalidDataException extends HttpException {
  constructor(field: string, value: any) {
    super(
      {
        message: `Dados inválidos`,
        error: 'Invalid Data',
        statusCode: HttpStatus.BAD_REQUEST,
        details: `Valor inválido para o campo '${field}': ${value}`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
} 