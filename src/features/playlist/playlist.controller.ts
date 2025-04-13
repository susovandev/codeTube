import e, { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import Playlist from './playlist.model';
import { CustomRequest } from '../../middleware/auth.middleware';
import cloudinary from '../../utils/cloudinary';
import playlistService from './playlist.service';
import mongoose from 'mongoose';
import { BadRequestError, InternalServerError } from '../../utils/custom.error';
import fs from 'fs';
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

  /**
   * @desc    Get a Playlist By Id
   * @route   GET /api/playlists/:playlistId
   * @access  Private
   */
  async getPlaylistsById(req: Request, res: Response) {
    const { playlistId } = req.params;
    const playlists = await playlistService.getPlaylistsById(playlistId);

    if (!playlists) {
      throw new Error('Failed to fetch playlists');
    }

    res
      .status(200)
      .json(new ApiResponse(200, 'Playlists fetched successfully', playlists));
  }

  /**
   * @desc    Update a Playlist By Id
   * @route   PATCH /api/playlists/:playlistId
   * @access  Private
   */

  async updatePlaylistsById(req: Request, res: Response, next: NextFunction) {
    // Get name, description, playlistCoverImage & playlistId from request
    const { name, description } = req.body;
    const playlistCoverImageLocalPath = req.file?.path;
    const { playlistId } = req.params;

    try {
      // Check if playlistId is valid
      if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new BadRequestError('Invalid playlist ID');
      }

      // Get playlist by id
      const playlist = await playlistService.getPlaylistsById(playlistId);

      if (!playlist) {
        throw new BadRequestError('Playlist not exists');
      }

      // Delete playlist cover image from cloudinary
      if (
        playlist?.playlistCoverImage &&
        playlist?.playlistCoverImage?.public_id
      ) {
        await cloudinary.deleteImageOnCloud(
          playlist?.playlistCoverImage?.public_id,
        );
      }

      // Update playlist name, description & playlistCoverImage
      if (playlistCoverImageLocalPath) {
        const playlistCoverImage = await cloudinary.uploadImageOnCloud(
          playlistCoverImageLocalPath,
          'playlist',
        );

        playlist.playlistCoverImage = {
          public_id: playlistCoverImage?.public_id!,
          secure_url: playlistCoverImage?.secure_url!,
        };
      }

      if (name) playlist.name = name;
      if (description) playlist.description = description;

      // Save playlist
      const updatedPlaylist = await playlist.save();

      if (!updatedPlaylist) {
        throw new InternalServerError('Failed to update playlist');
      }

      // Send response
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            'Playlist updated successfully',
            updatedPlaylist,
          ),
        );
    } catch (error) {
      // Delete local files
      if (
        playlistCoverImageLocalPath &&
        fs.existsSync(playlistCoverImageLocalPath)
      ) {
        fs.unlinkSync(playlistCoverImageLocalPath);
      }
      next(error);
    }
  }
}

export default new PlaylistController();
