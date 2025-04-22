/**
 * @swagger
 * components:
 *   schemas:
 *     Video:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6619b32d4c2f7fa4b4d9a9e7
 *         title:
 *           type: string
 *           example: My Updated Video
 *         description:
 *           type: string
 *           example: This is an updated description.
 *         category:
 *           type: string
 *           example: Technology
 *         thumbnail:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               example: thumbnails/abc123
 *             secure_url:
 *               type: string
 *               example: https://res.cloudinary.com/demo/image/upload/v123/thumbnails/abc123.jpg
 *         videoFile:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               example: videos/abc456
 *             secure_url:
 *               type: string
 *               example: https://res.cloudinary.com/demo/video/upload/v123/videos/abc456.mp4
 *         duration:
 *           type: number
 *           example: 125.4
 *         isPublished:
 *           type: boolean
 *           example: true
 *         owner:
 *           type: string
 *           example: 6619b32d4c2f7fa4b4d9a9e7
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-04-20T14:35:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-04-21T10:00:00.000Z
 */
