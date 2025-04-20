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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "64b6e8a8a8a8a8a8a8a8a8a8"
 *                     username:
 *                       type: string
 *                       example: "username"
 *                     email:
 *                       type: string
 *                       example: "email"
 *                     fullName:
 *                       type: string
 *                       example: "full name"
 *                     avatar:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: "public_id"
 *                         secure_url:
 *                           type: string
 *                           example: "secure_url"
 *                     coverImage:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: "public_id"
 *                         secure_url:
 *                           type: string
 *                           example: "secure_url"
 *                     createdAt:
 *                       type: string
 *                       example: "2023-01-01T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       example: "2023-01-01T00:00:00.000Z"
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
