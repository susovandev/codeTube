import { Types } from 'mongoose';
import { IVideo } from '../video/video.interfaces';
import Like from './like.model';
import { ILike } from './like.interface';

class LikeServices {
  async deleteUserLikeOnVideo(
    videoId: string,
    userId: Types.ObjectId | string,
  ): Promise<IVideo | null> {
    return await Like.findOneAndDelete({
      video: videoId,
      likedBy: userId,
    });
  }

  async createLikeOnVideo(
    videoId: string,
    userId: Types.ObjectId | string,
  ): Promise<ILike | null> {
    return await Like.create({
      video: videoId,
      likedBy: userId,
    });
  }

  async deleteUserLikeOnComment(
    commentId: string,
    userId: Types.ObjectId | string,
  ): Promise<ILike | null> {
    return await Like.findOneAndDelete({
      comment: commentId,
      likedBy: userId,
    });
  }

  async createLikeOnComment(
    commentId: string,
    userId: Types.ObjectId | string,
  ): Promise<ILike | null> {
    return await Like.create({
      comment: commentId,
      likedBy: userId,
    });
  }

  async deleteUserLikeOnTweet(
    tweetId: string,
    userId: Types.ObjectId | string,
  ): Promise<ILike | null> {
    return await Like.findOneAndDelete({
      tweet: tweetId,
      likedBy: userId,
    });
  }

  async createLikeOnTweet(
    tweetId: string,
    userId: Types.ObjectId | string,
  ): Promise<ILike | null> {
    return await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });
  }
}

export default new LikeServices();
