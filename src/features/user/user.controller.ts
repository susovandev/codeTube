import { Request, Response } from 'express';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, ForbiddenException } from '../../utils/custom.error';
import { ApiResponse } from '../../utils/ApiResponse';
import { User } from './user.model';
import { CustomRequest } from '../../middleware/auth.middleware';
import Cloudinary from '../../utils/cloudinary';
import { IImageInfo } from './user.interfaces';
import { sendResetPasswordEmail } from '../../utils/sendMail';
import { config } from '../../config/config';

class UserController {
  /**
   * @desc    Get Current User Profile
   * @route   GET /api/user/profile
   * @access  Private
   */
  async getCurrentUserProfile(req: CustomRequest, res: Response) {
    // Fetch the user details from the database
    const user = await userServices.findUserById(req.user?._id);

    // If user not found, throw an exception
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Send response with user details
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'User fetched successfully', user));
  }

  /**
   * @desc    Update User Profile
   * @route   PUT /api/user/profile-update
   * @access  Private
   */
  async updateUserProfile(req: CustomRequest, res: Response) {
    const { _id } = req.user!;

    // Extract user data from the request body
    const { username, email, fullName } = req.body;

    // Check if a user already exists with the provided details
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { fullName }],
    });

    // If a user with the given credentials exists, throw an error
    if (existingUser) {
      throw new BadRequestError(
        'User already exists with the provided details',
      );
    }

    // Update user details
    const updatedUser = await userServices.updateUser(_id, {
      username: username ? username : req.user?.username,
      email: email ? email.toLowerCase() : req.user?.email,
      fullName: fullName ? fullName : req.user?.fullName,
    });

    // If update fails, throw an error
    if (!updatedUser) {
      throw new ForbiddenException('User not found');
    }

    // Send success response
    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, 'User updated successfully', {
        username: updatedUser?.username,
        email: updatedUser?.email,
        fullName: updatedUser?.fullName,
      }),
    );
  }

  /**
   * @desc    Update User Avatar
   * @route   PUT /api/user/profile/avatar
   * @access  Private
   */

  async updateUserAvatar(req: CustomRequest, res: Response) {
    const { _id } = req.user!;

    // Extract avatar image from the request
    const avatarLocalFilePath = req.file?.path;

    if (!avatarLocalFilePath) {
      throw new BadRequestError('Please upload an avatar image.');
    }

    // Upload avatar image to Cloudinary
    const avatarData = await Cloudinary.uploadImageOnCloud(
      avatarLocalFilePath,
      'avatars',
    );

    // If upload fails, throw an error
    if (!avatarData) {
      throw new BadRequestError('Failed to upload avatar. Please try again.');
    }

    // Fetch the user details from the database
    const user = await User.findById(_id);

    if (!user) {
      throw new ForbiddenException('User does not exist or is unauthorized.');
    }
    // Delete previous avatar
    if (user?.avatar?.public_id) {
      await Cloudinary.deleteImageOnCloud(user?.avatar?.public_id);
    }

    // Update user avatar
    const updatedUser = await userServices.updateUser(_id, {
      avatar: {
        secure_url: avatarData?.secure_url,
        public_id: avatarData?.public_id,
      },
    });

    // If update fails, throw an error
    if (!updatedUser) {
      throw new ForbiddenException(
        'Unable to update avatar. Please try again.',
      );
    }

    // Send success response
    res.status(StatusCodes.OK).json(
      new ApiResponse<{ avatar: IImageInfo }>(
        StatusCodes.OK,
        'Avatar updated successfully',
        {
          avatar: {
            secure_url: avatarData?.secure_url,
            public_id: avatarData?.public_id,
          },
        },
      ),
    );
  }

  /**
   * @desc    Update User Cover Image
   * @route   PUT /api/user/profile/cover-image
   * @access  Private
   */

  async updateUserCoverImage(req: CustomRequest, res: Response) {
    const { _id } = req.user!;

    // Extract Cover image from the request
    const coverImageLocalFilePath = req.file?.path;

    if (!coverImageLocalFilePath) {
      throw new BadRequestError('Please upload an cover image.');
    }

    // Upload Cover image to Cloudinary
    const coverImageData = await Cloudinary.uploadImageOnCloud(
      coverImageLocalFilePath,
      'coverImages',
    );

    // If upload fails, throw an error
    if (!coverImageLocalFilePath) {
      throw new BadRequestError(
        'Failed to upload cover image. Please try again.',
      );
    }

    // Fetch the user details from the database
    const user = await User.findById(_id);

    if (!user) {
      throw new ForbiddenException('User does not exist or is unauthorized.');
    }

    // Delete previous avatar
    if (user?.coverImage?.public_id) {
      await Cloudinary.deleteImageOnCloud(user?.coverImage?.public_id);
    }

    // Update user cover image
    const updatedUser = await userServices.updateUser(_id, {
      coverImage: {
        secure_url: coverImageData?.secure_url!,
        public_id: coverImageData?.public_id!,
      },
    });

    // If update fails, throw an error
    if (!updatedUser) {
      throw new ForbiddenException(
        'Unable to update cover image. Please try again.',
      );
    }

    // Send success response
    res.status(StatusCodes.OK).json(
      new ApiResponse<{
        coverImage: IImageInfo;
      }>(StatusCodes.OK, 'Cover Image updated successfully', {
        coverImage: {
          public_id: coverImageData?.public_id!,
          secure_url: coverImageData?.secure_url!,
        },
      }),
    );
  }

  /**
   * @desc    Update User forget password
   * @route   PUT /api/user/profile/forget-password
   * @access  Private
   */
  async forgetPassword(req: Request, res: Response) {
    // Extract email from the request
    const { email } = req.body;

    if (!email) {
      throw new BadRequestError('Email is required');
    }

    // Fetch the user details from the database
    const user = await User.findOne({ email });

    if (!user) {
      throw new BadRequestError('User not found');
    }

    // Generate reset password token
    const resetToken = await user.getResetToken();

    const message = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    <h2 style="color: #333;">🔐 Password Reset Request</h2>

    <p>Hi ${user?.fullName || user?.username},</p>

    <p>We noticed you requested to reset your password on <strong>CodeTube</strong>. No worries — it happens to the best of us! 🙌</p>

    <p>To securely reset your password, please click the button below:</p>

    <a href="${config.clientUrl}/reset-password/${resetToken}" 
       style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
      🔄 Reset My Password
    </a>

    <p style="margin-top: 20px;">Or you can copy and paste this link into your browser:</p>
    <p style="word-break: break-word;">
      <a href="${config.clientUrl}/reset-password/${resetToken}">${config.clientUrl}/reset-password/${resetToken}</a>
    </p>

    <hr style="margin: 30px 0;">

    <h4 style="color: #444;">⏳ This link will expire in 15 minutes</h4>
    <p>For your security, the link above is valid for only a short time. If it expires, you'll need to request a new password reset.</p>

    <p>If you didn’t make this request, you can safely ignore this email. Rest assured your account is still secure with us.</p>

    <hr style="margin: 30px 0;">

    <h4 style="color: #444;">💡 Pro Tip</h4>
    <p>Once you've reset your password, we recommend logging in and reviewing your account settings to make sure everything looks good.</p>

    <p>And while you're at it... why not explore some of the latest features we’ve rolled out in <strong>CodeTube</strong>? We’re constantly improving to serve you better. 🚀</p>

    <p style="margin-top: 40px;">Stay safe,<br/><strong>The CodeTube Team</strong></p>

    <hr style="margin: 30px 0;">
    <p style="font-size: 12px; color: #999;">
      Need help or have questions? <a href="mailto:support@yourapp.com">Contact our support team</a> or just reply to this email.
    </p>
  </div>
`;

    // Send Token to user email
    await sendResetPasswordEmail(user?.email, 'Reset Password Token', message);

    // Send success response
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse<{ resetToken: string }>(
          StatusCodes.OK,
          'Reset password token sent successfully',
        ),
      );
  }
}

export default new UserController();
