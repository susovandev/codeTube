import { Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import Playlist from './playlist.model';
import { CustomRequest } from '../../middleware/auth.middleware';
import cloudinary from '../../utils/cloudinary';
import playlistService from './playlist.service';
class PlaylistController {
  /**
   * @desc    Create a Playlist
   * @route   POST /api/playlists/
   * @access  Private
   */
  async createPlaylist(req: CustomRequest, res: Response) {
    const { name, description } = req.body;
    const playlistCoverImageLocalPath = req.file?.path;

    if (!playlistCoverImageLocalPath) {
      throw new Error('Playlist cover image is required');
    }

    const playlistCoverImage = await cloudinary.uploadImageOnCloud(
      playlistCoverImageLocalPath,
      'playlist',
    );

    if (!playlistCoverImage) {
      throw new Error('Failed to upload playlist cover image');
    }

    const newPlaylist = await playlistService.createPlaylist({
      name,
      description,
      playlistCoverImage: {
        public_id: playlistCoverImage?.public_id,
        secure_url: playlistCoverImage?.secure_url,
      },
      owner: req.user?._id,
    });

    if (!newPlaylist) {
      throw new Error('Failed to create playlist');
    }

    res
      .status(201)
      .json(new ApiResponse(201, 'Playlist created successfully', newPlaylist));
  }
}

export default new PlaylistController();
