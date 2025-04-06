import { IImageInfo, IUser } from '../user/user.interfaces';

export interface IVideo {
  _id: string;
  videoFile: IImageInfo;
  owner: IUser;
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
