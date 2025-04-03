import { Types } from 'mongoose';
import { IUser } from './user.interfaces';
import { User } from './user.model';

class UserServices {
  async checkUserExits(email: string, username: string): Promise<IUser | null> {
    const user = await User.findOne({
      $and: [{ email }, { username }],
    });
    return user;
  }
  async createUser(requestBody: Partial<IUser>): Promise<IUser> {
    const users = await User.create(requestBody);
    return users;
  }

  async findUerById(_id: Types.ObjectId): Promise<IUser | null> {
    return await User.findById(_id);
  }
}

export default new UserServices();
