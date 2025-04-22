import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import playlistControllers from './playlist.controller';
import { validate } from '../../middleware/validation.middleware';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
} from './playlist.validation';
import { upload } from '../../middleware/multer.middleware';

const playlistRouter = Router();

playlistRouter.use(asyncWrapper(authMiddleware));

/**
 * @swagger
 * /playlists:
 *   post:
 *     summary: Create a Playlist
 *     description: Creates a new playlist with a name, description, and a cover image. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - playlistCoverImage
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Awesome Playlist
 *               description:
 *                 type: string
 *                 example: A mix of my favorite songs.
 *               playlistCoverImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Playlist created successfully
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
 *                   example: Playlist created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad request – Missing required fields or invalid image
 *       500:
 *         description: Internal server error
 */

playlistRouter
  .route('/')
  .post(
    upload.single('playlistCoverImage'),
    validate(createPlaylistSchema),
    asyncWrapper(playlistControllers.createPlaylist),
  );

/**
 * @swagger
 * /playlists/{playlistId}:
 *   get:
 *     summary: Get a Playlist by ID
 *     description: Retrieves a specific playlist by its ID. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to retrieve
 *     responses:
 *       200:
 *         description: Playlist fetched successfully
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
 *                   example: Playlists fetched successfully
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad request – Invalid playlist ID or playlist not found
 *       500:
 *         description: Internal server error
 */

playlistRouter
  .route('/:playlistId')
  .get(asyncWrapper(playlistControllers.getPlaylistsById));

/**
 * @swagger
 * /playlists/{playlistId}:
 *   patch:
 *     summary: Update a Playlist by ID
 *     description: Updates a playlist's name, description, and cover image. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to update
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Playlist Name
 *               description:
 *                 type: string
 *                 example: Updated description of the playlist.
 *               playlistCoverImage:
 *                 type: string
 *                 format: binary
 *                 description: New cover image file
 *     responses:
 *       200:
 *         description: Playlist updated successfully
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
 *                   example: Playlist updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Bad request – Invalid playlist ID or missing fields
 *       500:
 *         description: Internal server error
 */
playlistRouter
  .route('/:playlistId')
  .patch(
    upload.single('playlistCoverImage'),
    validate(updatePlaylistSchema),
    asyncWrapper(playlistControllers.updatePlaylistsById),
  );

/**
 * @swagger
 * /playlists/{playlistId}:
 *   delete:
 *     summary: Delete a Playlist by ID
 *     description: Deletes a playlist and its cover image from cloud storage. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to delete
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
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
 *                   example: Playlist deleted successfully
 *       400:
 *         description: Invalid playlist ID
 *       500:
 *         description: Internal server error
 */

playlistRouter
  .route('/:playlistId')
  .delete(asyncWrapper(playlistControllers.deletePlaylistsById));

/**
 * @swagger
 * /playlists/add/{videoId}/{playlistId}:
 *   patch:
 *     summary: Add Video to Playlist
 *     description: Adds a video to a user's playlist by video ID and playlist ID. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to add
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist to which the video will be added
 *     responses:
 *       200:
 *         description: Video added to playlist successfully
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
 *                   example: Video added to playlist successfully
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Playlist or video not found, or video already in playlist
 *       500:
 *         description: Internal server error
 */

playlistRouter
  .route('/add/:videoId/:playlistId')
  .patch(asyncWrapper(playlistControllers.addVideoToPlaylist));

/**
 * @swagger
 * /playlists/remove/{videoId}/{playlistId}:
 *   patch:
 *     summary: Remove Video from User Playlists
 *     description: Removes a video from a user's playlist by video ID and playlist ID. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the video to remove
 *       - in: path
 *         name: playlistId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the playlist from which the video will be removed
 *     responses:
 *       200:
 *         description: Video removed from playlist successfully
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
 *                   example: Video removed from playlist successfully
 *                 data:
 *                   $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Playlist or video not found, or video not found in playlist
 *       500:
 *         description: Internal server error
 */

playlistRouter
  .route('/remove/:videoId/:playlistId')
  .patch(asyncWrapper(playlistControllers.removeVideoToPlaylist));

/**
 * @swagger
 * /playlists/{userId}:
 *   get:
 *     summary: Get User Playlists
 *     description: Retrieves all playlists of a user by their user ID. Requires authentication.
 *     tags: [Playlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user whose playlists will be fetched
 *     responses:
 *       200:
 *         description: User's playlists fetched successfully
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
 *                   example: User Playlists fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Playlist'
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: Playlists not found for the user
 *       500:
 *         description: Internal server error
 */

playlistRouter
  .route('/user/:userId')
  .get(asyncWrapper(playlistControllers.getUserPlaylists));
export default playlistRouter;
