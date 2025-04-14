import { Document, Types } from 'mongoose';
import { IImageInfo, IUser } from '../user/user.interfaces';
import { IVideo } from '../video/video.interfaces';
export interface IPlaylist extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  playlistCoverImage: IImageInfo;
  videos: (Types.ObjectId | IVideo)[];
  owner: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
