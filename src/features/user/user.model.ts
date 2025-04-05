import { Schema, model } from 'mongoose';
import { IUser } from './user.interfaces';
import { config } from '../../config/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema: Schema<IUser> = new Schema(
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
      public_id: {
        type: String,
        trim: true,
        required: [true, 'Public ID is required'],
      },
      secure_url: {
        type: String,
        trim: [true, 'Secure URL is required'],
      },
    },
    coverImage: {
      public_id: {
        type: String,
        trim: true,
        required: [true, 'Public ID is required'],
      },
      secure_url: {
        type: String,
        trim: [true, 'Secure URL is required'],
      },
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

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, username: this.username, fullName: this.fullNam },
    config.accessTokenSecret as string,
    {
      expiresIn: 60 * 60 * 24,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, config.refreshTokenSecret as string, {
    expiresIn: 60 * 60 * 24 * 7,
  });
};
export const User = model<IUser>('User', userSchema);
