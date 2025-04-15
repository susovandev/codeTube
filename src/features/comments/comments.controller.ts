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

    console.log(`videoId`, videoId);
    console.log(`content`, content);

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new BadRequestError('Invalid video ID');
    }

    if (!content) {
      throw new BadRequestError('Content is required');
    }

    const video = await videoServices.getVideoById(videoId);
    console.log(`video`, video);

    if (!video) {
      throw new BadRequestError('Video not found');
    }

    const comment = await commentsService.createNewComment({
      content,
      owner: req.user?._id,
      video: video?._id,
    });
    console.log(`comment`, comment);
    if (!comment) {
      throw new InternalServerError('Failed to add comment');
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(StatusCodes.OK, 'Comment added successfully', comment),
      );
  }

  /**
   * @desc    Update a comment
   * @route   PATCH /api/comments/c/:commentId
   * @access  Private
   */

  async updateComment(
    req: Request<{ commentId: string }, {}, { content: string }>,
    res: Response,
  ) {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new BadRequestError('Invalid comment ID');
    }

    if (!content) {
      throw new BadRequestError('Content is required');
    }

    const comment = await commentsService.updateCommentById(commentId, {
      content,
    });

    if (!comment) {
      throw new InternalServerError('Failed to update comment');
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          'Comment updated successfully',
          comment,
        ),
      );
  }
}

export default new commentsController();
