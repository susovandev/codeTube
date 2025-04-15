import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import commentsController from './comments.controller';
import { validate } from '../../middleware/validation.middleware';
import { createCommentSchema } from './comments.validation';

const commentsRoutes = Router();

commentsRoutes.use(asyncWrapper(authMiddleware));

commentsRoutes
  .route('/:videoId')
  .post(
    validate(createCommentSchema),
    asyncWrapper(commentsController.addComment),
  );
export default commentsRoutes;
