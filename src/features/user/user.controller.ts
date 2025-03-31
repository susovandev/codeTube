import { Request, Response } from 'express';
import { IUser } from './user.interfaces';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../utils/custom.error';
import { createUserSchema } from './user.validation';

class UserController {
  async createUser(req: Request<{}, {}, IUser>, res: Response) {
    const { username, email, fullName, password } = req.body;
    const { error } = createUserSchema.validate(req.body);
    if (error) {
      throw new BadRequestError(error.message);
    }
    const ifUserExists = await userServices.checkUserExits(email, username);
    if (ifUserExists) {
      throw new BadRequestError('User already exists');
    }
    const users = await userServices.createUser({
      username,
      email,
      fullName,
      password,
    });

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: 'User created successfully',
      data: users,
    });
  }
}

export default new UserController();
