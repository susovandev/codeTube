import { IPlaylist } from './playlist.interface';
import Playlist from './playlist.model';

class PlaylistServices {
  async createPlaylist(
    requestBody: Partial<IPlaylist>,
  ): Promise<IPlaylist | null> {
    return await Playlist.create(requestBody);
  }

  async getPlaylistsById(playlistId: string): Promise<IPlaylist | null> {
    return await Playlist.findById(playlistId);
  }

  async deletePlaylistsById(playlistId: string): Promise<null> {
    return await Playlist.findByIdAndDelete(playlistId);
  }

  async getUserPlaylists(userId: string) {
    return await Playlist.find({ owner: userId });
  }
}

export default new PlaylistServices();
