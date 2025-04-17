import { Types } from 'mongoose';
import { IVideo } from '../video/video.interfaces';
import Like from './like.model';

class LikeServices {
  async findUserLikeOnVideo(
    videoId: string,
    userId: Types.ObjectId | string,
  ): Promise<IVideo | null> {
    return await Like.findOne({ video: videoId, likedBy: userId });
  }
}

export default new LikeServices();
