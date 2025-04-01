import { Request, Response } from 'express';
import { IUser } from './user.interfaces';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../utils/custom.error';
import cloudinary from '../../utils/cloudinary';
import { ApiResponse } from '../../utils/ApiTResponse';

class UserController {
  async createUser(req: Request<{}, {}, IUser>, res: Response) {
    const { username, email, fullName, password } = req.body;
    const { avatar, coverImage } = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const avatarLocalFilePath = avatar?.[0]?.path as string;
    const coverImageLocalFilePath = coverImage?.[0]?.path as string;

    const ifUserExists = await userServices.checkUserExits(email, username);
    if (ifUserExists) {
      throw new BadRequestError('User already exists');
    }

    if (!avatarLocalFilePath) {
      throw new BadRequestError('Avatar is required');
    }
    const avatarData = await cloudinary.uploadImageOnCloud(avatarLocalFilePath);

    let coverImageData;
    if (coverImageLocalFilePath) {
      coverImageData = await cloudinary.uploadImageOnCloud(
        coverImageLocalFilePath,
      );
    }
    const users = await userServices.createUser({
      username,
      email,
      fullName,
      password,
      avatar: avatarData?.secure_url,
      coverImage: coverImageData?.secure_url || '',
    });

    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse<IUser>(
          StatusCodes.CREATED,
          `Welcome ${users?.fullName}, Your account has been created successfully`,
          users,
        ),
      );
  }
}

export default new UserController();
