import { Document, Types } from 'mongoose';
import { IVideo } from '../video/video.interfaces';

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  password: string;
  refreshToken?: string;
  watchHistory?: IVideo[];
  otp?: string;
  otpExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}
