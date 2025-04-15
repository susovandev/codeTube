import { Request, Response } from 'express';
import { BadRequestError, InternalServerError } from '../../utils/custom.error';
import { CustomRequest } from '../../middleware/auth.middleware';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../../utils/ApiResponse';
import videoServices from '../video/video.services';
import commentsService from './comments.service';
import mongoose from 'mongoose';
class commentsController {
  /**
   * @desc    Add a comment
   * @route   POST /api/comments/:videoId
   * @access  Private
   */

  async addComment(req: CustomRequest, res: Response) {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new BadRequestError('Invalid video ID');
    }

    if (!content) {
      throw new BadRequestError('Content is required');
    }

    const video = await videoServices.getVideoById(videoId);

    if (!video) {
      throw new BadRequestError('Video not found');
    }

    const comment = await commentsService.createNewComment({
      content,
      owner: req.user?._id,
      video: video?._id,
    });

    if (!comment) {
      throw new InternalServerError('Failed to add comment');
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, 'Comment added successfully', comment),
      );
  }
}

export default new commentsController();
