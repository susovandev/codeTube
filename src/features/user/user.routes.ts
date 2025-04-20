import { Router } from 'express';
import userController from './user.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { validate } from '../../middleware/validation.middleware';
import {
  forgetPasswordSchema,
  updatePasswordSchema,
  updateUserSchema,
} from './user.validation';
import { authMiddleware } from '../../middleware/auth.middleware';
import { upload } from '../../middleware/multer.middleware';

const userRouter = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful profile fetch
 */
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

userRouter.put(
  '/profile/cover-image',
  asyncWrapper(authMiddleware),
  upload.single('coverImage'),
  asyncWrapper(userController.updateUserCoverImage),
);

userRouter.post(
  '/profile/forget-password',
  validate(forgetPasswordSchema),
  asyncWrapper(userController.forgetPassword),
);

userRouter.post(
  '/profile/reset-password/:resetToken',
  validate(updatePasswordSchema),
  asyncWrapper(userController.resetPassword),
);
export default userRouter;
