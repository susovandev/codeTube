import { Schema, model } from 'mongoose';
import { IUser } from './user.interfaces';

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      required: [true, 'Avatar is required'],
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    refreshToken: {
      type: String,
      trim: true,
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    otp: {
      type: String,
      trim: true,
    },
    otpExpire: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const User = model<IUser>('User', userSchema);
