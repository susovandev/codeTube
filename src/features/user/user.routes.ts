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
 *     summary: Get the currently logged-in user's profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 success:
 *                   type: boolean
 *                   example: true
 *       403:
 *         description: User not found or forbidden access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 success:
 *                   type: boolean
 *                   example: false
 */

userRouter.get(
  '/profile',
  asyncWrapper(authMiddleware),
  asyncWrapper(userController.getCurrentUserProfile),
);

/**
 * @swagger
 * /users/profile-update:
 *   put:
 *     summary: Update the current user's profile details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     fullName:
 *                       type: string
 *                       example: John Doe
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T14:00:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2024-04-21T16:00:00.000Z
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User already exists with the provided details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: User already exists with the provided details
 *                 success:
 *                   type: boolean
 *                   example: false
 *       403:
 *         description: User not found or not authorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 success:
 *                   type: boolean
 *                   example: false
 */

userRouter.put(
  '/profile-update',
  validate(updateUserSchema),
  asyncWrapper(authMiddleware),
  asyncWrapper(userController.updateUserProfile),
);

/**
 * @swagger
 * /users/profile/update-avatar:
 *   patch:
 *     summary: Upload and update the user's avatar image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Avatar updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: avatars/abc123xyz
 *                         secure_url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v123456789/avatars/abc123xyz.jpg
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: No avatar image uploaded or upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Please upload an avatar image.
 *                 success:
 *                   type: boolean
 *                   example: false
 *       403:
 *         description: User not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: User does not exist or is unauthorized.
 *                 success:
 *                   type: boolean
 *                   example: false
 */

userRouter.patch(
  '/profile/update-avatar',
  asyncWrapper(authMiddleware),
  upload.single('avatar'),
  asyncWrapper(userController.updateUserAvatar),
);

/**
 * @swagger
 * /users/profile/update-cover-image:
 *   patch:
 *     summary: Upload and update the user's cover image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Cover Image updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     coverImage:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: coverImages/abc123xyz
 *                         secure_url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v123456789/coverImages/abc123xyz.jpg
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: No cover image uploaded or upload failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Please upload a cover image.
 *                 success:
 *                   type: boolean
 *                   example: false
 *       403:
 *         description: User not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 403
 *                 message:
 *                   type: string
 *                   example: User does not exist or is unauthorized.
 *                 success:
 *                   type: boolean
 *                   example: false
 */

userRouter.patch(
  '/profile/update-cover-image',
  asyncWrapper(authMiddleware),
  upload.single('coverImage'),
  asyncWrapper(userController.updateUserCoverImage),
);

/**
 * @swagger
 * /users/profile/forget-password:
 *   post:
 *     summary: Send password reset link to user's email
 *     description: Sends a password reset link to the user's registered email address. The link expires in 15 minutes.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Password reset email sent successfully. Please check your inbox (or spam folder).
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Email not provided or user not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: No user found with the provided email address.
 *                 success:
 *                   type: boolean
 *                   example: false
 */

userRouter.post(
  '/profile/forget-password',
  validate(forgetPasswordSchema),
  asyncWrapper(userController.forgetPassword),
);

/**
 * @swagger
 * /users/profile/reset-password/{resetToken}:
 *   post:
 *     summary: Reset user password
 *     description: Resets the user's password using a valid reset token sent to their email. The token expires in 15 minutes.
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: resetToken
 *         required: true
 *         schema:
 *           type: string
 *         description: The password reset token sent to the user's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 example: NewSecurePassword123!
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Your password has been successfully reset! You can now log in with your new password.
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid or expired token, or missing password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: This password reset link is invalid or has expired. Please request a new one.
 *                 success:
 *                   type: boolean
 *                   example: false
 */

userRouter.post(
  '/profile/reset-password/:resetToken',
  validate(updatePasswordSchema),
  asyncWrapper(userController.resetPassword),
);
export default userRouter;
