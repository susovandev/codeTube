import { Request, Response } from 'express';
import { CustomRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { BadRequestError } from '../../utils/custom.error';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import likeService from './like.service';
import videoServices from '../video/video.services';
import commentsService from '../comments/comments.service';
import tweetService from '../tweet/tweet.service';

class LikeController {
  /**
   * @desc    Toggle video like
   * @route   POST /api/likes/toggle/v/:videoId
   * @access  Private
   */
  async toggleVideoLike(req: CustomRequest, res: Response) {
    // Get video id from request
    const { videoId } = req.params;

    // Check if video id is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new BadRequestError('Invalid video ID');
    }

    // Delete existing like
    const existingLike = await likeService.deleteUserLikeOnVideo(
      videoId,
      req.user?._id,
    );

    if (existingLike) {
      // Send response
      return res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, 'Like deleted successfully'));
    }

    const video = await videoServices.getVideoById(videoId);
    if (!video) {
      throw new BadRequestError('Video not found');
    }
    // Create new like
    const newLike = await likeService.createLikeOnVideo(videoId, req.user?._id);

    // Send response
    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          'Like created successfully',
          newLike,
        ),
      );
  }

  /**
   * @desc    Toggle comment like
   * @route   POST /api/likes/toggle/c/:commentId
   * @access  Private
   */
  async toggleCommentLike(req: CustomRequest, res: Response) {
    // Get comment id from request
    const { commentId } = req.params;

    // Check if comment id is valid
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      throw new BadRequestError('Invalid comment ID');
    }

    // Delete existing like
    const existingLike = await likeService.deleteUserLikeOnComment(
      commentId,
      req.user?._id,
    );

    if (existingLike) {
      // Send response
      return res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, 'Comment deleted successfully'));
    }

    const comment = await commentsService.getCommentById(commentId);
    if (!comment) {
      throw new BadRequestError('Comment not found');
    }
    // Create new like
    const newLike = await likeService.createLikeOnComment(
      commentId,
      req.user?._id,
    );

    // Send response
    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          'Comment created successfully',
          newLike,
        ),
      );
  }

  /**
   * @desc    Toggle Tweet like
   * @route   POST /api/likes/toggle/t/:tweetId
   * @access  Private
   */
  async toggleTweetLike(req: CustomRequest, res: Response) {
    // Get tweet id from request
    const { tweetId } = req.params;

    // Check if tweet id is valid
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
      throw new BadRequestError('Invalid tweet ID');
    }

    // Delete existing like
    const existingLike = await likeService.deleteUserLikeOnTweet(
      tweetId,
      req.user?._id,
    );

    if (existingLike) {
      // Send response
      return res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, 'Tweet deleted successfully'));
    }

    const tweet = await tweetService.getTweetById(tweetId);

    if (!tweet) {
      throw new BadRequestError('Tweet not found');
    }

    // Create new like
    const newLike = await likeService.createLikeOnTweet(tweetId, req.user?._id);

    // Send response
    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          'Tweet created successfully',
          newLike,
        ),
      );
  }
}

export default new LikeController();
