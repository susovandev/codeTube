import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import videoControllers from './video.controller';
import { upload } from '../../middleware/multer.middleware';
import { validate } from '../../middleware/validation.middleware';
import { publishVideoSchema } from './video.validation.';
import { authMiddleware } from '../../middleware/auth.middleware';

const videoRouter = Router();

videoRouter.use(asyncWrapper(authMiddleware));

/**
 * @swagger
 * /videos:
 *   post:
 *     summary: Get all videos with pagination
 *     description: Fetches all videos with pagination, sorting, and optional search query or user filter.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of videos per page.
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Text to search in video titles.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by (e.g., createdAt, title).
 *       - in: query
 *         name: sortType
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sorting order.
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter videos by user ID.
 *     responses:
 *       200:
 *         description: Videos fetched successfully
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
 *                   example: Videos fetched successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     videos:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Video'
 *                     totalVideos:
 *                       type: integer
 *                       example: 100
 *                     totalPages:
 *                       type: integer
 *                       example: 10
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */

videoRouter.get('/', asyncWrapper(videoControllers.getAllVideos));

/**
 * @swagger
 * /videos/upload:
 *   post:
 *     summary: Upload a video
 *     description: Uploads a video file along with a thumbnail and creates a new video entry.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - video
 *               - thumbnail
 *               - title
 *               - description
 *               - category
 *             properties:
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Video file to be uploaded.
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Thumbnail image for the video.
 *               title:
 *                 type: string
 *                 example: My First Video
 *               description:
 *                 type: string
 *                 example: This is a demo video about cool things.
 *               category:
 *                 type: string
 *                 example: Education
 *     responses:
 *       201:
 *         description: Video uploaded successfully
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
 *                   example: Video uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 6619b32d4c2f7fa4b4d9a9e7
 *                     title:
 *                       type: string
 *                       example: My First Video
 *                     thumbnail:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: thumbnails/abc123
 *                         secure_url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/image/upload/v123/thumbnails/abc123.jpg
 *                     videoFile:
 *                       type: object
 *                       properties:
 *                         public_id:
 *                           type: string
 *                           example: videos/abc456
 *                         secure_url:
 *                           type: string
 *                           example: https://res.cloudinary.com/demo/video/upload/v123/videos/abc456.mp4
 *                     owner:
 *                       type: string
 *                       example: 6619b32d4c2f7fa4b4d9a9e7
 *                     duration:
 *                       type: number
 *                       example: 120.5
 *       400:
 *         description: Failed to upload video or thumbnail
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
 *                   example: Please upload a video and thumbnail.
 */

videoRouter.post(
  '/upload',
  upload.fields([
    {
      name: 'video',
      maxCount: 1,
    },
    {
      name: 'thumbnail',
      maxCount: 1,
    },
  ]),
  validate(publishVideoSchema),
  asyncWrapper(videoControllers.publishVideo),
);

/**
 * @swagger
 * /videos/{videoId}:
 *   get:
 *     summary: Get a video by ID
 *     description: Retrieves a video by its unique ID.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: ID of the video
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video fetched successfully
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
 *                   example: Video fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid or missing video ID
 *       401:
 *         description: Unauthorized
 */

videoRouter.route('/:videoId').get(asyncWrapper(videoControllers.getVideoById));

/**
 * @swagger
 * /videos/{videoId}:
 *   patch:
 *     summary: Update a video
 *     description: Update video details (title, description, category) and optionally replace the thumbnail image.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: ID of the video to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Title
 *               description:
 *                 type: string
 *                 example: Updated description of the video.
 *               category:
 *                 type: string
 *                 example: Technology
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: New thumbnail image file to upload.
 *     responses:
 *       200:
 *         description: Video updated successfully
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
 *                   example: Video updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Video'
 *       400:
 *         description: Invalid video ID, thumbnail upload failure, or other update error
 *       401:
 *         description: Unauthorized
 */

videoRouter
  .route('/:videoId')
  .patch(
    upload.single('thumbnail'),
    asyncWrapper(videoControllers.updateVideoById),
  );

/**
 * @swagger
 * /videos/{videoId}:
 *   delete:
 *     summary: Delete a video by ID
 *     description: Deletes a video and its associated assets from the server.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: ID of the video to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video deleted successfully
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
 *                   example: Video deleted successfully
 *       400:
 *         description: Video not found or invalid ID
 *       401:
 *         description: Unauthorized
 */

videoRouter
  .route('/:videoId')
  .delete(asyncWrapper(videoControllers.deleteVideoById));

/**
 * @swagger
 * /videos/toggle/publish/{videoId}:
 *   patch:
 *     summary: Toggle publish status of a video
 *     description: Toggles the `isPublished` status of a video by its ID.
 *     tags: [Video]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: ID of the video
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Video status updated successfully
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
 *                   example: Video status updated successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     videoId:
 *                       type: string
 *                       example: 6619b32d4c2f7fa4b4d9a9e7
 *                     isPublished:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Video not found or invalid ID
 *       401:
 *         description: Unauthorized
 */

videoRouter
  .route('/toggle/publish/:videoId')
  .patch(asyncWrapper(videoControllers.togglePublishStatus));

export default videoRouter;
