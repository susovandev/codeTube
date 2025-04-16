import { Request, Response } from 'express';
import { CustomRequest } from '../../middleware/auth.middleware';
import { InternalServerError } from '../../utils/custom.error';
import { ApiResponse } from '../../utils/ApiResponse';
import { StatusCodes } from 'http-status-codes';
import tweetService from './tweet.service';

class TweetController {
  /**
   * @desc    Create a New Tweet
   * @route   POST /api/tweets/
   * @access  Private
   */
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

  /**
   * @desc    Update a Tweet by ID
   * @route   PATCH /api/tweets/:tweetId
   * @access  Private
   */

  async updateTweet(req: Request<{ tweetId: string }>, res: Response) {
    // Get tweet id from request
    const { tweetId } = req.params;

    // Get content from request
    const { content } = req.body;

    // Update tweet
    const updatedTweet = await tweetService.updateTweetById(tweetId, {
      content,
    });

    if (!updatedTweet) {
      throw new InternalServerError('Failed to update tweet');
    }

    // Send response
    res
      .status(StatusCodes.OK)
      .json(
        new ApiResponse(
          StatusCodes.OK,
          'Tweet updated successfully',
          updatedTweet,
        ),
      );
  }
}

export default new TweetController();
