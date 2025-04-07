import { IImageInfo, IUser } from '../user/user.interfaces';
import { Types } from 'mongoose';

export interface IVideo {
  _id: Types.ObjectId;
  videoFile: IImageInfo;
  owner: Types.ObjectId | IUser;
  thumbnail: IImageInfo;
  title: string;
  description: string;
  duration: number;
  views?: number;
  isPublished?: boolean;
  category: string;
  isFeatured?: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
