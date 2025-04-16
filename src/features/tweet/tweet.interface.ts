import { Document, Types } from 'mongoose';
import { IUser } from '../user/user.interfaces';

export interface ITweet extends Document {
  content: string;
  owner: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
