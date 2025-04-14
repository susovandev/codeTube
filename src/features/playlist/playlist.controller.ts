import { NextFunction, Request, Response } from 'express';
import { ApiResponse } from '../../utils/ApiResponse';
import { CustomRequest } from '../../middleware/auth.middleware';
import cloudinary from '../../utils/cloudinary';
import playlistService from './playlist.service';
import mongoose from 'mongoose';
import { BadRequestError, InternalServerError } from '../../utils/custom.error';
import fs from 'fs';
import { IPlaylist } from './playlist.interface';
import videoServices from '../video/video.services';
import { StatusCodes } from 'http-status-codes';
import Playlist from './playlist.model';

class PlaylistController {
  /**
   * @desc    Create a Playlist
   * @route   POST /api/playlists/
   * @access  Private
   */
  async createPlaylist(req: CustomRequest, res: Response) {
    // Get name, description, playlistCoverImage From Request
    const { name, description } = req.body;
    const playlistCoverImageLocalPath = req.file?.path;

    if (!playlistCoverImageLocalPath) {
      throw new BadRequestError('Playlist cover image is required');
    }

    // Upload playlistCoverImage to Cloudinary
    const playlistCoverImage = await cloudinary.uploadImageOnCloud(
      playlistCoverImageLocalPath,
      'playlist',
    );

    if (!playlistCoverImage) {
      throw new BadRequestError('Failed to upload playlist cover image');
    }

    // Create playlist
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
      throw new InternalServerError('Failed to create playlist');
    }

    // Send response
    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          'Playlist created successfully',
          newPlaylist,
        ),
      );
  }

  /**
   * @desc    Get a Playlist By Id
   * @route   GET /api/playlists/:playlistId
   * @access  Private
   */
  async getPlaylistsById(req: Request<{ playlistId: string }>, res: Response) {
    // Get playlistId from request
    const { playlistId } = req.params;

    // Get playlist by id
    const playlists = await playlistService.getPlaylistsById(playlistId);
    if (!playlists) {
      throw new BadRequestError('Failed to fetch playlists');
    }

    // Send response
    res
      .status(200)
      .json(new ApiResponse(200, 'Playlists fetched successfully', playlists));
  }

  /**
   * @desc    Update a Playlist By Id
   * @route   PATCH /api/playlists/:playlistId
   * @access  Private
   */

  async updatePlaylistsById(
    req: Request<{ playlistId: string }, {}, IPlaylist>,
    res: Response,
    next: NextFunction,
  ) {
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
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
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

  /**
   * @desc    Delete a Playlist By Id
   * @route   DELETE /api/playlists/:playlistId
   * @access  Private
   */

  async deletePlaylistsById(
    req: Request<{ playlistId: string }>,
    res: Response,
  ) {
    const { playlistId } = req.params;

    // Check if playlistId is valid
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
      throw new BadRequestError('Invalid playlist ID');
    }

    // Get playlist by id
    const playlist = await playlistService.getPlaylistsById(playlistId);

    if (!playlist) {
      throw new InternalServerError('Failed to delete playlist');
    }

    // Delete playlist cover image from cloudinary
    try {
      if (
        playlist?.playlistCoverImage &&
        playlist?.playlistCoverImage?.public_id
      ) {
        await cloudinary.deleteImageOnCloud(
          playlist?.playlistCoverImage?.public_id,
        );
      }
    } catch (error) {
      console.error('Cloudinary Delete Error:', error);
      throw new InternalServerError('Error deleting image');
    }

    // Delete playlist
    await playlistService.deletePlaylistsById(playlistId);

    // Send response
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'Playlist deleted successfully'));
  }

  /**
   * @desc    Get User Playlists
   * @route   GET /api/playlists/:playlistId
   * @access  Private
   */

  async getUserPlaylists(req: Request<{ userId: string }>, res: Response) {
    // Get user id from request
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID');
    }

    // Get playlists by user id
    const playlists = await playlistService.getUserPlaylistsDetails(userId);

    if (!playlists) {
      throw new InternalServerError('Failed to fetch playlists');
    }

    // Send response
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          'User Playlists fetched successfully',
          playlists,
        ),
      );
  }

  /**
   * @desc    Add Video to User Playlists
   * @route   PATCH /api/playlists/add/:videoId/:playlistId
   * @access  Private
   */

  async addVideoToPlaylist(
    req: Request<{ videoId: string; playlistId: string }>,
    res: Response,
  ) {
    // Get video id and playlist id from request
    const { videoId, playlistId } = req.params;

    // Get playlist by id
    const playlist = await playlistService.getPlaylistsById(playlistId);
    if (!playlist) {
      throw new BadRequestError('Playlist not found');
    }

    // Get video by id
    const video = await videoServices.getVideoById(videoId);
    if (!video) {
      throw new BadRequestError('Video not found');
    }

    // check if already exists
    const alreadyExists = playlist.videos.includes(video._id);
    if (alreadyExists) {
      throw new BadRequestError('Video already exists in playlist');
    }

    // Add video to playlist
    playlist.videos.push(video._id);
    await playlist.save();

    // Send response
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          'Video added to playlist successfully',
          playlist,
        ),
      );
  }
}

export default new PlaylistController();
