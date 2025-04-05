import { Router } from 'express';
import userController from './user.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { validate } from '../../middleware/validation.middleware';
import { updateUserSchema } from './user.validation';
import { authMiddleware } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/multer.middleware';

const userRouter = Router();

userRouter.get(
  '/profile',
  asyncWrapper(authMiddleware),
  asyncWrapper(userController.getCurrentUserProfile),
);

userRouter.put(
  '/profile-update',
  validate(updateUserSchema),
  asyncWrapper(authMiddleware),
  asyncWrapper(userController.updateUserProfile),
);

userRouter.put(
  '/profile/avatar',
  asyncWrapper(authMiddleware),
  upload.single('avatar'),
  asyncWrapper(userController.updateUserAvatar),
);

export default userRouter;
