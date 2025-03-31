import { IUser } from './user.interfaces';
import { User } from './user.model';

class UserServices {
  async checkUserExits(email: string, username: string): Promise<Boolean> {
    const user = await User.findOne({
      $or: [{ email }, { username }],
    });
    return user ? true : false;
  }
  async createUser(requestBody: Partial<IUser>): Promise<IUser> {
    const users = await User.create(requestBody);
    return users;
  }
}

export default new UserServices();
