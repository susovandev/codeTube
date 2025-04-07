import { IVideo } from './video.interfaces';
import { Video } from './video.model';

class VideoServices {
  async createVideo(requestBody: Partial<IVideo>): Promise<IVideo> {
    return await Video.create(requestBody);
  }

  async getVideoById(videoId: string): Promise<IVideo | null> {
    return await Video.findById(videoId);
  }
}

export default new VideoServices();
