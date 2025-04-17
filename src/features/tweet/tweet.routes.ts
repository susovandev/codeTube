import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import tweetController from './tweet.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createTweetSchema, updateTweetSchema } from './tweet.validation';

const tweetRouter = Router();

tweetRouter.use(asyncWrapper(authMiddleware));

tweetRouter
  .route('/')
  .post(validate(createTweetSchema), asyncWrapper(tweetController.createTweet));

tweetRouter
  .route('/user/:userId')
  .get(asyncWrapper(tweetController.getUserTweets));
tweetRouter
  .route('/:tweetId')
  .patch(validate(updateTweetSchema), asyncWrapper(tweetController.updateTweet))
  .delete(asyncWrapper(tweetController.deleteTweet));
export default tweetRouter;
