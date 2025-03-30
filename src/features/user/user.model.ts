import { Schema, model } from 'mongoose';
import { IUser } from './user.interfaces';

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
        required: true,
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
