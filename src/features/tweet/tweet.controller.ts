import { Request, Response } from 'express';
import { CustomRequest } from '../../middleware/auth.middleware';
import { InternalServerError } from '../../utils/custom.error';
import { ApiResponse } from '../../utils/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import tweetService from './tweet.service';

class TweetController {
  async createTweet(req: CustomRequest, res: Response) {
    // Get content from request
    const { content } = req.body;

    // Create tweet
    const tweet = await tweetService.createNewTweet({
      content,
      owner: req.user?._id,
    });

    if (!tweet) {
      throw new InternalServerError('Failed to create tweet');
    }

    // Send response
    res
      .status(StatusCodes.CREATED)
      .json(
        new ApiResponse(
          StatusCodes.CREATED,
          'Tweet created successfully',
          tweet,
        ),
      );
  }
}

export default new TweetController();
