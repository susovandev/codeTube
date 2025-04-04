import { Types } from 'mongoose';
import { IUser } from './user.interfaces';
import { User } from './user.model';

class UserServices {
  async checkUserExists(
    email: string,
    username: string,
  ): Promise<IUser | null> {
    const user = await User.findOne({
      $and: [{ email }, { username }],
    });
    return user;
  }
  async createUser(requestBody: Partial<IUser>): Promise<IUser> {
    const users = await User.create(requestBody);
    return users;
  }

  async findUserById(_id: Types.ObjectId): Promise<IUser | null> {
    return await User.findById(_id).select('-password -refreshToken');
  }

  async updateUser(
    _id: Types.ObjectId,
    data: Partial<IUser>,
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate({ _id }, data, { new: true }).select(
      '-password -refreshToken',
    );
  }
}

export default new UserServices();
