import { Document, Types } from 'mongoose';
import { IVideo } from '../video/video.interfaces';
import { IUser } from '../user/user.interfaces';

export interface IComments extends Document {
  content: string;
  video: Types.ObjectId | IVideo;
  owner: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
