import { Request, Response } from 'express';
import { IUser } from './user.interfaces';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, InternalServerError } from '../../utils/custom.error';
import cloudinary from '../../utils/cloudinary';
import { ApiResponse } from '../../utils/ApiResponse';
import fs from 'fs';
import { User } from './user.model';
import { generateAccessTokenAndRefreshToken } from '../../utils/generateToken';

class UserController {
  async createUser(req: Request<{}, {}, IUser>, res: Response) {
    // Get Data
    const { username, email, fullName, password } = req.body;
    const { avatar, coverImage } = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const avatarLocalFilePath = avatar?.[0]?.path as string;
    const coverImageLocalFilePath = coverImage?.[0]?.path as string;

    try {
      // Check User Existence
      const ifUserExists = await userServices.checkUserExits(email, username);
      if (ifUserExists) {
        throw new BadRequestError('User already exists');
      }

      if (!avatarLocalFilePath) {
        throw new BadRequestError('Avatar is required');
      }

      // Upload Images
      const avatarData = await cloudinary.uploadImageOnCloud(
        avatarLocalFilePath,
        'avatars',
      );
      let coverImageData;
      if (coverImageLocalFilePath) {
        coverImageData = await cloudinary.uploadImageOnCloud(
          coverImageLocalFilePath,
          'coverImages',
        );
      }

      // Create User
      const users = await userServices.createUser({
        username,
        email: email.toLowerCase(),
        fullName,
        password,
        avatar: avatarData?.secure_url,
        coverImage: coverImageData?.secure_url || '',
      });

      // Generate Token
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(users._id);

      const newUser = await User.findById(users._id).select(
        '-password -refreshToken',
      );
      if (!newUser) {
        throw new InternalServerError('Error creating user');
      }
      // Set Cookies Securely & Send Response
      res
        .status(StatusCodes.CREATED)
        .cookie('refreshToken', refreshToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .cookie('accessToken', accessToken, {
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        })
        .json(
          new ApiResponse<IUser | null>(
            StatusCodes.CREATED,
            `Welcome ${users?.fullName}, Your account has been created successfully`,
            newUser,
          ),
        );
    } catch (error) {
      if (fs.existsSync(avatarLocalFilePath)) {
        fs.unlinkSync(avatarLocalFilePath);
      }
      if (fs.existsSync(coverImageLocalFilePath)) {
        fs.unlinkSync(coverImageLocalFilePath);
      }
      throw error;
    }
  }
}

export default new UserController();
