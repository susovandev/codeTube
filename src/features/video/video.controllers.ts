import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../utils/custom.error';
import Cloudinary from '../../utils/cloudinary';
import { Video } from './video.model';
import { CustomRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import fs from 'fs';

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
      const videoInfo = await Video.create({
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
}

export default new VideoController();
