import { Document, Types } from 'mongoose';
import { IVideo } from '../video/video.interfaces';
import { IComments } from '../comments/comments.interface';
import { ITweet } from '../tweet/tweet.interface';
import { IUser } from '../user/user.interfaces';

export interface ILike extends Document {
  video: Types.ObjectId | IVideo;
  comment: Types.ObjectId | IComments;
  tweet: Types.ObjectId | ITweet;
  likedBy: Types.ObjectId | IUser;
}
