import { NextFunction, Request, Response } from 'express';
import {
  ForbiddenException,
  UnAuthorizedException,
} from '../utils/custom.error';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/config';
import { User } from '../features/user/user.model';
import { IUser } from '../features/user/user.interfaces';
import Logger from '../config/logger';

export interface CustomRequest extends Request {
  user: IUser;
}

export const authMiddleware = async (
  req: CustomRequest,
  _: Response,
  next: NextFunction,
) => {
  const accessToken =
    req?.cookies?.accessToken || req?.headers?.authorization?.split(' ')[1];

  if (!accessToken) {
    throw new UnAuthorizedException('Unauthorized');
  }
  try {
    const decodedToken = jwt.verify(
      accessToken,
      config.accessTokenSecret as string,
    ) as JwtPayload;

    const user = await User.findById(decodedToken._id).lean();

    if (!user) {
      throw new ForbiddenException('User not found');
    }
    req.user = user;
    next();
  } catch (error) {
    Logger.error(`error`, error);
    throw new UnAuthorizedException('Unauthorized');
  }
};
