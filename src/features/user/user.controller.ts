import { Request, Response } from 'express';
import { ILoginCredentials, IUser } from './user.interfaces';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  ForbiddenException,
  InternalServerError,
  UnAuthorizedException,
} from '../../utils/custom.error';
import cloudinary from '../../utils/cloudinary';
import { ApiResponse } from '../../utils/ApiResponse';
import fs from 'fs';
import { User } from './user.model';
import { generateAccessTokenAndRefreshToken } from '../../utils/generateToken';
import { CustomRequest } from '../../middleware/auth.middleware';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config/config';

class UserController {
  async createUser(req: Request<{}, {}, IUser>, res: Response) {
    // Extract User Data
    const { username, email, fullName, password } = req.body;
    const { avatar, coverImage } = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const avatarLocalFilePath = avatar?.[0]?.path as string;
    const coverImageLocalFilePath = coverImage?.[0]?.path as string;

    try {
      // Check if User Already Exists
      const ifUserExists = await userServices.checkUserExists(email, username);
      if (ifUserExists) {
        throw new BadRequestError('User already exists');
      }

      // Validate Avatar Presence
      if (!avatarLocalFilePath) {
        throw new BadRequestError('Avatar is required');
      }

      // Upload Avatar
      const avatarData = await cloudinary.uploadImageOnCloud(
        avatarLocalFilePath,
        'avatars',
      );

      // Upload Cover Image (Optional)
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

      // Fetch User Without Sensitive Data
      const newUser = await userServices.findUserById(users._id);
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

  async loginUser(req: Request<{}, {}, ILoginCredentials>, res: Response) {
    const { username, email, password } = req.body;

    // Check User Existence
    let user;
    user = await userServices.checkUserExists(email, username);
    if (!user) {
      throw new BadRequestError(
        'User not found. Please check your credentials.',
      );
    }

    // Check Password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid password. Please try again.');
    }

    // Generate Token
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    // Fetch User Without Sensitive Data
    const sanitizedUser = await userServices.findUserById(user._id);

    // Set Cookies Securely & Send Response
    res
      .status(StatusCodes.OK)
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
          StatusCodes.OK,
          `Welcome ${sanitizedUser?.fullName}`,
          sanitizedUser,
        ),
      );
  }

  async logout(req: CustomRequest, res: Response) {
    if (!req.user || !req.user._id) {
      throw new UnAuthorizedException('User not found or not authenticated');
    }

    // Update refreshToken in DB
    await userServices.updateUser(req.user._id, { refreshToken: '' });

    // Clear cookies properly
    res
      .status(StatusCodes.OK)
      .clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      })
      .json(new ApiResponse(StatusCodes.OK, 'User logged out successfully'));
  }

  async refreshAccessToken(req: Request, res: Response) {
    // Get Refresh Token
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new UnAuthorizedException(
        'Token not found. Please provide a valid refresh token.',
      );
    }
    try {
      // Verify Refresh Token
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        config.refreshTokenSecret as string,
      ) as JwtPayload;

      // Get User from DB
      const user = await User.findById(decodedToken._id);
      if (!user) {
        throw new ForbiddenException(
          'Unauthorized access. User does not exist.',
        );
      }

      // Check Refresh Token
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ForbiddenException(
          'Invalid refresh token. Please login again.',
        );
      }

      // Generate Token
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

      // Set Cookies Securely & Send Response
      res
        .status(StatusCodes.OK)
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
          new ApiResponse<{ accessToken: string; refreshToken: string }>(
            StatusCodes.OK,
            'New access token generated successfully.',
            {
              accessToken,
              refreshToken,
            },
          ),
        );
    } catch (error) {
      console.log(`error`, error);
      throw new UnAuthorizedException(
        'Invalid or expired refresh token. Please login again.',
      );
    }
  }
  async getCurrentUserProfile(req: CustomRequest, res: Response) {
    // Fetch User
    const user = await userServices.findUserById(req.user?._id);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Send Response
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'User fetched successfully', user));
  }

  async updateUserProfile(req: CustomRequest, res: Response) {
    const { _id } = req.user!;
    // Extract User Data
    const { username, email, fullName } = req.body;

    // Check if User Already Exists with the provided details
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { fullName }],
    });
    if (existingUser) {
      throw new BadRequestError(
        'User already exists with the provided details',
      );
    }

    // Update User
    const updatedUser = await userServices.updateUser(_id, {
      username: username ? username : req.user?.username,
      email: email ? email.toLowerCase() : req.user?.email,
      fullName: fullName ? fullName : req.user?.fullName,
    });
    if (!updatedUser) {
      throw new ForbiddenException('User not found');
    }

    // Send Response
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          'User updated successfully',
          updatedUser,
        ),
      );
  }
}

export default new UserController();
