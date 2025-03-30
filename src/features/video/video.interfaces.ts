import { IUser } from '../user/user.interfaces';

export interface IVideo {
  _id: string;
  videoFile: string;
  owner: IUser;
  thumbnail: string;
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
