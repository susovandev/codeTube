import { Router } from 'express';
import { upload } from '../../middleware/multer.middleware';
import { validate } from '../../middleware/validation.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import authController from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createUserSchema, userLoginSchema } from '../user/user.validation';

const authRouter = Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user with avatar and optional cover image
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - fullName
 *               - password
 *               - avatar
 *             properties:
 *               username:
 *                 type: string
 *                 example: susovan
 *               email:
 *                 type: string
 *                 format: email
 *                 example: susovandas.dev@gmail.com
 *               fullName:
 *                 type: string
 *                 example: Susovan Das
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourSecurePassword123
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully, tokens set in cookies
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only accessToken and refreshToken cookies
 *             schema:
 *               type: string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Welcome Susovan Das, Your account has been created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 680537f8603103fc80db7c8f
 *                     username:
 *                       type: string
 *                       example: susovan
 *                     email:
 *                       type: string
 *                       example: susovandas.dev@gmail.com
 *                     fullName:
 *                       type: string
 *                       example: Susovan Das
 *                     avatar:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: images/avatars/glkllforpbsbqb7zvhvl
 *                         secure_url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v1/avatar.png
 *                     coverImage:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: images/coverImages/g81ohjo1qmqb7kno4jrq
 *                         secure_url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v1/cover.png
 *                     watchHistory:
 *                       type: array
 *                       items: {}
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: User already exists or avatar not uploaded
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
 */

authRouter.post(
  '/signup',
  upload.fields([
    {
      name: 'avatar',
      maxCount: 1,
    },
    {
      name: 'coverImage',
      maxCount: 1,
    },
  ]),
  validate(createUserSchema),
  asyncWrapper(authController.createUser),
);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login user with email or username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: susovandas.dev@gmail.com
 *               username:
 *                 type: string
 *                 example: susovan
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourSecurePassword123
 *     responses:
 *       200:
 *         description: User logged in successfully, tokens set in cookies
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only accessToken and refreshToken cookies
 *             schema:
 *               type: string
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
 *                   example: Welcome Susovan Das
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 680537f8603103fc80db7c8f
 *                     username:
 *                       type: string
 *                       example: susovan
 *                     email:
 *                       type: string
 *                       example: susovandas.dev@gmail.com
 *                     fullName:
 *                       type: string
 *                       example: Susovan Das
 *                     avatar:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                         secure_url:
 *                           type: string
 *                     coverImage:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                         secure_url:
 *                           type: string
 *                     watchHistory:
 *                       type: array
 *                       items: {}
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     __v:
 *                       type: integer
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Invalid credentials or password
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
 *                   example: Invalid password. Please try again.
 *                 success:
 *                   type: boolean
 *                   example: false
 */

authRouter.post(
  '/signin',
  validate(userLoginSchema),
  asyncWrapper(authController.loginUser),
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the currently authenticated user
 *     description: Clears authentication cookies and invalidates the refresh token in the database.
 *     tags: [Auth]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
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
 *                   example: User logged out successfully
 *                 data:
 *                   type: string
 *                   example: null
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: User not found or not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: User not found or not authenticated
 *                 success:
 *                   type: boolean
 *                   example: false
 */

authRouter.post(
  '/logout',
  asyncWrapper(authMiddleware),
  asyncWrapper(authController.logout),
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access and refresh tokens using a valid refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (if not sent in cookies)
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *     responses:
 *       200:
 *         description: New access and refresh tokens issued successfully
 *         headers:
 *           Set-Cookie:
 *             description: HTTP-only accessToken and refreshToken cookies
 *             schema:
 *               type: string
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
 *                   example: New access token generated successfully.
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                 success:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Refresh token not found or invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: Token not found. Please provide a valid refresh token.
 *                 success:
 *                   type: boolean
 *                   example: false
 *       403:
 *         description: Refresh token is invalid or user does not exist
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
 *                   example: Unauthorized access. User does not exist.
 *                 success:
 *                   type: boolean
 *                   example: false
 */

authRouter.post(
  '/refresh-token',
  asyncWrapper(authController.refreshAccessToken),
);

export default authRouter;
