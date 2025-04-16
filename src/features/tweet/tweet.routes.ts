import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import tweetController from './tweet.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createTweetSchema } from './tweet.validation';

const tweetRouter = Router();

tweetRouter.use(asyncWrapper(authMiddleware));

tweetRouter
  .route('/')
  .post(validate(createTweetSchema), asyncWrapper(tweetController.createTweet));
export default tweetRouter;
