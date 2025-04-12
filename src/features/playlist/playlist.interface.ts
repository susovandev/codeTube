import { Document } from 'mongoose';
import { IVideo } from '../video/video.interfaces';
import { IUser } from '../user/user.interfaces';
export interface IPlaylist extends Document {
  name: string;
  description: string;
  videos: IVideo[];
  owner: IUser;
}
