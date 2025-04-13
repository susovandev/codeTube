import { IPlaylist } from './playlist.interface';
import Playlist from './playlist.model';

class PlaylistServices {
  async createPlaylist(requestBody: Partial<IPlaylist>) {
    return await Playlist.create(requestBody);
  }
}

export default new PlaylistServices();
