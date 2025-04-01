import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { BadRequestError } from '../utils/custom.error';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/"/g, ''))
        .join(', ');
      return next(new BadRequestError(errorMessage));
    }

    req.body = value;
    next();
  };
};
