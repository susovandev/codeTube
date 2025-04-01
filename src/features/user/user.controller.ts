import { Request, Response } from 'express';
import { IUser } from './user.interfaces';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../utils/custom.error';

class UserController {
  async createUser(req: Request<{}, {}, IUser>, res: Response) {
    const { username, email, fullName, password } = req.body;
    const { avatar, coverImage } = req.files as {
      [key: string]: Express.Multer.File[];
    };
    if (!avatar) {
      throw new BadRequestError('Avatar is required');
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
      avatar: avatar[0].path,
      coverImage: coverImage && coverImage[0].path,
    });

    res.status(StatusCodes.CREATED).json({
      status: true,
      message: 'User created successfully',
      data: users,
    });
  }
}

export default new UserController();
