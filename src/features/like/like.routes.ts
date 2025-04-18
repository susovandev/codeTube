import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import likeController from './like.controller';
import { authMiddleware } from '../../middleware/auth.middleware';

const likeRouter = Router();

likeRouter.use(asyncWrapper(authMiddleware));

likeRouter
  .route('/toggle/v/:videoId')
  .post(asyncWrapper(likeController.toggleVideoLike));

likeRouter
  .route('/toggle/c/:commentId')
  .post(asyncWrapper(likeController.toggleCommentLike));

likeRouter
  .route('/toggle/t/:tweetId')
  .post(asyncWrapper(likeController.toggleTweetLike));

likeRouter.route('/videos').get(asyncWrapper(likeController.getLikedVideos));
export default likeRouter;
