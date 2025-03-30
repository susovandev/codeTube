import { StatusCodes } from 'http-status-codes';
export abstract class CustomError extends Error {
  abstract status: string;
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends CustomError {
  status = 'error';
  statusCode = StatusCodes.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

export class UnAuthorizedException extends CustomError {
  status = 'error';
  statusCode = StatusCodes.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerError extends CustomError {
  status = 'error';
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenException extends CustomError {
  status = 'error';
  statusCode = StatusCodes.FORBIDDEN;
  constructor(message: string) {
    super(message);
  }
}
