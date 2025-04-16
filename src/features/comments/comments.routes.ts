import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import commentsController from './comments.controller';
import { validate } from '../../middleware/validation.middleware';
import {
  createCommentSchema,
  updateCommentSchema,
} from './comments.validation';

const commentsRoutes = Router();

commentsRoutes.use(asyncWrapper(authMiddleware));

commentsRoutes
  .route('/:videoId')
  .get(commentsController.getAllVideoComments)
  .post(
    validate(createCommentSchema),
    asyncWrapper(commentsController.addComment),
  );

commentsRoutes
  .route('/c/:commentId')
  .patch(
    validate(updateCommentSchema),
    asyncWrapper(commentsController.updateComment),
  )
  .delete(asyncWrapper(commentsController.deleteComment));
export default commentsRoutes;
