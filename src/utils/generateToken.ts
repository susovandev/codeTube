import { Types } from 'mongoose';
import { User } from '../features/user/user.model';
import { BadRequestError } from './custom.error';

export const generateAccessTokenAndRefreshToken = async (
  userId: Types.ObjectId,
) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError('User not found');
  }
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};
