import { Request, Response } from 'express';
import { ILoginCredentials, IUser } from '../user/user.interfaces';
import userServices from '../user/user.services';
import {
  BadRequestError,
  ForbiddenException,
  InternalServerError,
  UnAuthorizedException,
} from '../../utils/custom.error';
import cloudinary from '../../utils/cloudinary';
import { generateAccessTokenAndRefreshToken } from '../../utils/generateToken';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../../utils/ApiResponse';
import { CustomRequest } from '../../middleware/auth.middleware';
import { JwtPayload } from 'jsonwebtoken';
import { config } from '../../config/config';
import { User } from '../user/user.model';
import fs from 'fs';
import jwt from 'jsonwebtoken';

class AuthController {
  /**
   * @desc Register a new user
   * @route POST /api/auth/register
   * @access Public
   */
  async createUser(req: Request<{}, {}, IUser>, res: Response) {
    // Extract user data from request body
    const { username, email, fullName, password } = req.body;
    const { avatar, coverImage } = req.files as {
      [key: string]: Express.Multer.File[];
    };

    // Extract file paths for avatar and cover image
    const avatarLocalFilePath = avatar?.[0]?.path as string;
    const coverImageLocalFilePath = coverImage?.[0]?.path as string;

    // Validate that avatar is present
    if (!avatarLocalFilePath) {
      throw new BadRequestError('Please upload an avatar image.');
    }

    try {
      // Check if user already exists
      const ifUserExists = await userServices.checkUserExists(email, username);
      if (ifUserExists) {
        throw new BadRequestError(
          'User already exists with the provided details',
        );
      }

      // Upload avatar image to Cloudinary
      const avatarData = await cloudinary.uploadImageOnCloud(
        avatarLocalFilePath,
        'avatars',
      );

      // Upload cover image to Cloudinary (if provided)
      let coverImageData;
      if (coverImageLocalFilePath) {
        coverImageData = await cloudinary.uploadImageOnCloud(
          coverImageLocalFilePath,
          'coverImages',
        );
      }

      // Create new user in database
      const users = await userServices.createUser({
        username,
        email: email.toLowerCase(),
        fullName,
        password,
        avatar: {
          public_id: avatarData?.public_id!,
          secure_url: avatarData?.secure_url!,
        },
        coverImage: {
          public_id: coverImageData?.public_id || '',
          secure_url: coverImageData?.secure_url || '',
        },
      });

      // Generate access and refresh tokens
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(users._id);

      // Fetch user details without sensitive data
      const newUser = await userServices.findUserById(users._id);
      if (!newUser) {
        throw new InternalServerError('Error creating user');
      }

      // Set secure HTTP-only cookies and send response
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
      // Remove uploaded files in case of an error
      if (fs.existsSync(avatarLocalFilePath)) {
        fs.unlinkSync(avatarLocalFilePath);
      }
      if (fs.existsSync(coverImageLocalFilePath)) {
        fs.unlinkSync(coverImageLocalFilePath);
      }
      throw error;
    }
  }

  /**
   * @desc Login a user
   * @route POST /api/auth/login
   * @access Public
   */
  async loginUser(req: Request<{}, {}, ILoginCredentials>, res: Response) {
    const { username, email, password } = req.body;

    // Find user by email or username
    let user = await userServices.checkUserExists(email, username);
    if (!user) {
      throw new BadRequestError(
        'User not found. Please check your credentials.',
      );
    }

    // Validate user password
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new BadRequestError('Invalid password. Please try again.');
    }

    // Generate new tokens
    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    // Fetch sanitized user data
    const sanitizedUser = await userServices.findUserById(user._id);

    // Set secure HTTP-only cookies and send response
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

  /**
   * @desc Logout a user
   * @route POST /api/auth/logout
   * @access Private
   */
  async logout(req: CustomRequest, res: Response) {
    if (!req.user || !req.user._id) {
      throw new UnAuthorizedException('User not found or not authenticated');
    }

    // Clear refresh token from database
    await userServices.updateUser(req.user._id, { refreshToken: '' });

    // Clear authentication cookies and send response
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

  /**
   * @desc Refresh Access Token using Refresh Token
   * @route POST /api/auth/refresh-token
   * @access Public
   */
  async refreshAccessToken(req: Request, res: Response) {
    // Retrieve refresh token from cookies or request body
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new UnAuthorizedException(
        'Token not found. Please provide a valid refresh token.',
      );
    }
    try {
      // Verify refresh token
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        config.refreshTokenSecret as string,
      ) as JwtPayload;

      // Fetch user from database
      const user = await User.findById(decodedToken._id);
      if (!user) {
        throw new ForbiddenException(
          'Unauthorized access. User does not exist.',
        );
      }

      // Validate refresh token
      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ForbiddenException(
          'Invalid refresh token. Please login again.',
        );
      }

      // Generate new tokens
      const { accessToken, refreshToken } =
        await generateAccessTokenAndRefreshToken(user._id);

      // Set secure cookies and send response
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
      console.log(error);
      throw new UnAuthorizedException(
        'Invalid or expired refresh token. Please login again.',
      );
    }
  }
}

export default new AuthController();
