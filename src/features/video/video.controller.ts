import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../../utils/custom.error';
import Cloudinary from '../../utils/cloudinary';
import { CustomRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import fs from 'fs';
import videoServices from './video.services';
import { Video } from './video.model';
import { IVideo } from './video.interfaces';

class VideoController {
  /**
   * @desc    Get all videos with pagination
   * @route   POST /api/videos
   * @access  Private
   */

  async getAllVideos(req: Request, res: Response) {
    // Extract pagination and sorting parameters
    const {
      page = '1',
      limit = '10',
      query = '',
      sortBy = 'createdAt',
      sortType = 'desc',
      userId,
    } = req.query as {
      page?: string;
      limit?: string;
      query?: string;
      sortBy?: string;
      sortType?: 'asc' | 'desc';
      userId?: string;
    };

    // Parse pagination and sorting parameters
    const pageNo = parseInt(page, 10);
    const limitNo = parseInt(limit, 10);
    const sortOrder = sortType === 'desc' ? -1 : 1;

    // Define query filter
    type VideoQueryFilter = {
      title?: { $regex: string; $options: string };
      user?: string;
    };

    const filter: VideoQueryFilter = {
      title: { $regex: query, $options: 'i' },
    };

    // Apply user filter
    if (userId) {
      filter.user = userId;
    }

    const sortOptions: Record<string, 1 | -1> = {
      [sortBy]: sortOrder,
    };

    // Fetch videos from database
    const videos = await Video.find(filter)
      .sort(sortOptions)
      .skip((pageNo - 1) * limitNo)
      .limit(limitNo);

    const totalVideos = await Video.countDocuments(filter);

    // Calculate total pages
    const totalPages = Math.ceil(totalVideos / limitNo);

    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, 'Videos fetched successfully', {
        videos,
        totalVideos,
        totalPages,
      }),
    );
  }

  /**
   * @desc    Upload a video
   * @route   POST /api/videos/upload
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
   * @route   GET /api/videos/:videoId
   * @access  Private
   */

  async getVideoById(req: Request, res: Response) {
    // Extract video ID from request
    const { videoId } = req.params;

    // Check if video ID is provided
    if (!videoId) {
      throw new BadRequestError('Video ID is required');
    }

    // Get video by ID
    const video = await videoServices.getVideoById(videoId);

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
   * @route   DELETE /api/videos/:videoId
   * @access  Private
   */

  async deleteVideoById(req: Request<{ videoId: string }>, res: Response) {
    // Extract video ID from request
    const { videoId } = req.params;

    // Check if video ID is provided
    if (!videoId) {
      throw new BadRequestError('Video ID is required');
    }

    // Delete video
    const video = await videoServices.deleteVideoById(videoId);

    // If video is not found, throw an error
    if (!video) {
      throw new BadRequestError('Video not found');
    }

    // Send response
    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'Video deleted successfully'));
  }

  /**
   * @desc    Update a video
   * @route   PATCH /api/videos/:videoId
   * @access  Private
   */

  async updateVideoById(
    req: Request<{ videoId: string }, {}, Partial<IVideo>>,
    res: Response,
  ) {
    const { title, description, category, tags } = req.body;
    const { videoId } = req.params;
    const thumbnailLocalFilePath = req.file;

    try {
      const video = await videoServices.getVideoById(videoId);
      if (!video) {
        throw new BadRequestError('Video not found');
      }

      // Delete old thumbnail from Cloudinary
      if (video.thumbnail?.public_id) {
        await Cloudinary.deleteImageOnCloud(video?.thumbnail?.public_id);
      }

      // Upload new thumbnail
      if (thumbnailLocalFilePath) {
        const thumbnailData = await Cloudinary.uploadImageOnCloud(
          thumbnailLocalFilePath?.path,
          'thumbnails',
        );

        if (!thumbnailData) {
          throw new BadRequestError(
            'Failed to upload thumbnail. Please try again.',
          );
        }

        video.thumbnail = {
          public_id: thumbnailData?.public_id,
          secure_url: thumbnailData?.secure_url,
        };

        // Delete local file after upload
        if (fs.existsSync(thumbnailLocalFilePath?.path)) {
          fs.unlinkSync(thumbnailLocalFilePath?.path);
        }
      }

      // Update other fields
      if (title) video.title = title;
      if (description) video.description = description;
      if (category) video.category = category;
      if (tags) video.tags = tags;

      const updatedVideo = await video.save();

      res
        .status(StatusCodes.OK)
        .json(
          new ApiResponse(
            StatusCodes.OK,
            'Video updated successfully',
            updatedVideo,
          ),
        );
    } catch (error) {
      // Clean up local thumbnail if exists
      if (
        thumbnailLocalFilePath &&
        fs.existsSync(thumbnailLocalFilePath.path)
      ) {
        fs.unlinkSync(thumbnailLocalFilePath.path);
      }

      console.error('Video update error:', error);
      throw new BadRequestError(
        'Something went wrong while updating the video.',
      );
    }
  }

  /**
   * @desc    Update a video
   * @route   PATCH /api/videos/:videoId
   * @access  Private
   */

  async togglePublishStatus(req: Request, res: Response) {
    const { videoId } = req.params;

    const video = await videoServices.getVideoById(videoId);

    if (!video) {
      throw new BadRequestError('Video not found');
    }

    video.isPublished = !video.isPublished;
    await video.save();
    res.status(StatusCodes.OK).json(
      new ApiResponse(StatusCodes.OK, 'Video status updated successfully', {
        videoId: video?._id,
        isPublished: video?.isPublished,
      }),
    );
  }
}

export default new VideoController();
