import { Types } from 'mongoose';
import { IUser } from './user.interfaces';
import { User } from './user.model';

class UserServices {
  /**
   * Check if a user exists by email or username.
   */
  async checkUserExists(
    email: string,
    username: string,
  ): Promise<IUser | null> {
    return await User.findOne({ $or: [{ email }, { username }] });
  }

  /**
   * Create a new user.
   */
  async createUser(requestBody: Partial<IUser>): Promise<IUser> {
    return await User.create(requestBody);
  }

  /**
   * Find user by ID (excluding sensitive fields).
   */
  async findUserById(_id: Types.ObjectId): Promise<IUser | null> {
    return await User.findById(_id).select('-password -refreshToken');
  }

  /**
   * Update user details by ID.
   */
  async updateUser(
    _id: Types.ObjectId,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      _id,
      { $set: data },
      { new: true },
    ).select('-password -refreshToken');
  }
}

export default new UserServices();
