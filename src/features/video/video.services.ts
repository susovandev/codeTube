import { IVideo } from './video.interfaces';
import { Video } from './video.model';

class VideoServices {
  async createVideo(requestBody: Partial<IVideo>): Promise<IVideo> {
    return await Video.create(requestBody);
  }

  async getVideoById(videoId: string): Promise<IVideo | null> {
    return await Video.findById({ _id: videoId });
  }

  async deleteVideoById(videoId: string): Promise<null> {
    return Video.findOneAndDelete({ _id: videoId }, { new: true });
  }
}

export default new VideoServices();
