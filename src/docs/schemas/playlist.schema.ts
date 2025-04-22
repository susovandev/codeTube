/**
 * @swagger
 * components:
 *   schemas:
 *     Playlist:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6807803a2b4e8654f30a572d
 *         name:
 *           type: string
 *           example: My Awesome Playlist
 *         description:
 *           type: string
 *           example: A mix of my favorite songs.
 *         playlistCoverImage:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               example: images/playlist/n5wtieukrgtqmkhhc6nh
 *             secure_url:
 *               type: string
 *               example: https://res.cloudinary.com/dl6htbdus/image/upload/v1745322045/images/playlist/n5wtieukrgtqmkhhc6nh.jpg
 *         videos:
 *           type: array
 *           items:
 *             type: string
 *           example: []
 *         owner:
 *           type: string
 *           example: 6805cb75a11e284db800c085
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-22T11:40:42.117Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-04-22T11:40:42.117Z
 *         __v:
 *           type: integer
 *           example: 0
 */
