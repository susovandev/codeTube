import { Document, Types } from 'mongoose';
import { IVideo } from '../video/video.interfaces';
import { IImageInfo, IUser } from '../user/user.interfaces';
export interface IPlaylist extends Document {
  _id: string;
  name: string;
  description: string;
  playlistCoverImage: IImageInfo;
  videos: IVideo[];
  owner: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
