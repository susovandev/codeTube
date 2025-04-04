import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import { CustomError } from '../utils/custom.error';
import { StatusCodes } from 'http-status-codes';
export const errorMiddleware = (
  err: CustomError | Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  config.environment === 'development' && console.log(err);
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      status: false,
      message: err.message,
    });
  }

  if (err instanceof SyntaxError) {
    res.status(StatusCodes.BAD_REQUEST).json({
      status: false,
      message: 'Invalid JSON format',
    });
  }

  if (err instanceof Error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      status: false,
      message: err.message,
    });
  }
  next();
};
