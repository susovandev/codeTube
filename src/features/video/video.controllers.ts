import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../utils/custom.error';
import Cloudinary from '../../utils/cloudinary';
import { CustomRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import fs from 'fs';
import videoServices from './video.services';
import { Types } from 'mongoose';

class VideoController {
  /**
   * @desc    Upload a video
   * @route   POST /api/video/upload
   * @access  Private
   */
  async publishVideo(req: CustomRequest, res: Response) {
    // Extract video details from request
    const { title, description, category, tags } = req.body;

    // Extract video and thumbnail from request
    const { video, thumbnail } = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // Get local file paths
    const videoLocalFilePath = video?.[0]?.path;
    const thumbnailLocalFilePath = thumbnail?.[0]?.path;

    // Check if video and thumbnail are uploaded
    if (!videoLocalFilePath || !thumbnailLocalFilePath) {
      throw new BadRequestError('Please upload a video and thumbnail.');
    }

    try {
      // Upload video and thumbnail to Cloudinary
      const videoData = await Cloudinary.uploadVideoOnCloud(videoLocalFilePath);

      const thumbnailData = await Cloudinary.uploadImageOnCloud(
        thumbnailLocalFilePath,
        'thumbnails',
      );

      // If upload fails, throw an error
      if (!videoData || !thumbnailData) {
        throw new BadRequestError(
          'Failed to upload video or thumbnail. Please try again.',
        );
      }

      // Create video
      const videoInfo = await videoServices.createVideo({
        videoFile: {
          public_id: videoData?.public_id,
          secure_url: videoData?.secure_url,
        },
        thumbnail: {
          public_id: thumbnailData?.public_id,
          secure_url: thumbnailData?.secure_url,
        },
        title,
        description,
        category,
        tags,
        owner: req.user?._id,
        duration: videoData?.duration,
      });

      // Send the response with the video details
      res
        .status(StatusCodes.CREATED)
        .json(
          new ApiResponse(
            StatusCodes.CREATED,
            'Video uploaded successfully',
            videoInfo,
          ),
        );
    } catch (error) {
      // Delete the video and thumbnail if upload fails or anything goes wrong when creating the video
      if (videoLocalFilePath && fs.existsSync(videoLocalFilePath)) {
        fs.unlinkSync(videoLocalFilePath);
      }
      if (thumbnailLocalFilePath && fs.existsSync(thumbnailLocalFilePath)) {
        fs.unlinkSync(thumbnailLocalFilePath);
      }
      console.error('Video Upload Error:', error);
      throw new BadRequestError('Error uploading video');
    }
  }

  /**
   * @desc    Get a video
   * @route   GET /api/video/:videoId
   * @access  Private
   */

  async getVideoById(req: Request, res: Response) {
    // Extract video ID from request
    const { videoId } = req.params;

    // Check if video ID is provided
    if (!videoId) {
      throw new BadRequestError('Video ID is required');
    }

    // Convert video ID to ObjectId
    const objectId = new Types.ObjectId(videoId);

    // Get video by ID
    const video = await videoServices.getVideoById(objectId);

    // If video is not found, throw an error
    if (!video) {
      throw new BadRequestError('Video not found');
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, 'Video fetched successfully', video),
      );
  }

  /**
   * @desc    Delete a video
   * @route   DELETE /api/video/:videoId
   * @access  Private
   */

  async deleteVideoById(req: Request<{ videoId: string }>, res: Response) {
    // Extract video ID from request
    const { videoId } = req.params;

    // Check if video ID is provided
    if (!videoId) {
      throw new BadRequestError('Video ID is required');
    }

    // Validate videoId before converting
    if (!Types.ObjectId.isValid(videoId)) {
      throw new BadRequestError('Invalid video ID');
    }

    // Convert video ID to ObjectId
    const objectId = new Types.ObjectId(videoId);

    // Delete video
    const video = await videoServices.deleteVideoById(objectId);

    // If video is not found, throw an error
    if (!video) {
      throw new BadRequestError('Video not found');
    }

    // Send response
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'Video deleted successfully'));
  }
}

export default new VideoController();
