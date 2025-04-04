import { Request, Response } from 'express';
import userServices from './user.services';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, ForbiddenException } from '../../utils/custom.error';
import { ApiResponse } from '../../utils/ApiResponse';
import { User } from './user.model';
import { CustomRequest } from '../../middleware/auth.middleware';

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
   * @route   PUT /api/user/profile
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
