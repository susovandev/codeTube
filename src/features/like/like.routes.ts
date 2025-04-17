import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import likeController from './like.controller';

const likeRouter = Router();

likeRouter
  .route('/toggle/v/:videoId')
  .post(asyncWrapper(likeController.toggleVideoLike));

export default likeRouter;
