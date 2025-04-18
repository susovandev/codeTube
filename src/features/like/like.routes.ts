import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import likeController from './like.controller';

const likeRouter = Router();

likeRouter
  .route('/toggle/v/:videoId')
  .post(asyncWrapper(likeController.toggleVideoLike));

likeRouter
  .route('/toggle/c/:commentId')
  .post(asyncWrapper(likeController.toggleCommentLike));

likeRouter
  .route('/toggle/t/:tweetId')
  .post(asyncWrapper(likeController.toggleTweetLike));
export default likeRouter;
