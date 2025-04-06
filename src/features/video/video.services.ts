import { IVideo } from './video.interfaces';
import { Video } from './video.model';

class VideoServices {
  async createVideo(requestBody: Partial<IVideo>): Promise<IVideo> {
    return await Video.create(requestBody);
  }
}

export default new VideoServices();
