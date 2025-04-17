import { Request, Response } from 'express';
import Like from './like.model';
import { CustomRequest } from '../../middleware/auth.middleware';
import { ApiResponse } from '../../utils/ApiResponse';
import { BadRequestError } from '../../utils/custom.error';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import likeService from './like.service';

class LikeController {
  async toggleVideoLike(req: CustomRequest, res: Response) {
    // Get video id from request
    const { videoId } = req.params;

    // Check if video id is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      throw new BadRequestError('Invalid video ID');
    }

    // Get video by id
    const existingLike = await likeService.findUserLikeOnVideo(
      videoId,
      req.user?._id,
    );

    // If like exists, delete it
    if (existingLike) {
      await existingLike.deleteOne();

      // Send response
      return res
        .status(StatusCodes.OK)
        .json(new ApiResponse(StatusCodes.OK, 'Like deleted successfully'));
    }

    // Create new like
    const newLike = await Like.create({
      video: videoId,
      owner: req.user?._id,
    });

    // Send response
    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          'Like added successfully',
          newLike,
        ),
      );
  }
}

export default new LikeController();
