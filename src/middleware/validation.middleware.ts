import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { StatusCodes } from 'http-status-codes';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      res.status(StatusCodes.BAD_REQUEST).json({
        status: false,
        message: 'Validation Errors',
        error: error.details[0].message.replace(/"/g, ''),
      });
    }
    next();
  };
};
