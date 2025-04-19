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

  async getAllVideoComments(req: Request<{ videoId: string }>, res: Response) {
    // Get video id from request
    const { videoId } = req.params;

    // Check if video id is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new BadRequestError('Invalid video ID');
    }

    // Get video by id
    const comments = await commentsService.getAllVideoComments(videoId);

    if (!comments) {
      throw new InternalServerError('Failed to fetch comments');
    }

    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          'Comments fetched successfully',
          comments,
        ),
      );
  }
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

  /**
   * @desc    Update a comment
   * @route   PATCH /api/comments/c/:commentId
   * @access  Private
   */

  async deleteComment(req: Request<{ commentId: string }>, res: Response) {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new BadRequestError('Invalid comment ID');
    }

    const comment = await commentsService.deleteCommentById(commentId);

    if (!comment) {
      throw new InternalServerError('Failed to delete comment');
    }

    res
      .status(StatusCodes.OK)
      .json(new ApiResponse(StatusCodes.OK, 'Comment deleted successfully'));
  }
}

export default new commentsController();
