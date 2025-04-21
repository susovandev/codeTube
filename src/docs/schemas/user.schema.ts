/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 6619b32d4c2f7fa4b4d9a9e7
 *         username:
 *           type: string
 *           example: johndoe
 *         email:
 *           type: string
 *           example: johndoe@example.com
 *         fullName:
 *           type: string
 *           example: John Doe
 *         avatar:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               example: avatars/abc123
 *             secure_url:
 *               type: string
 *               example: https://res.cloudinary.com/demo/image/upload/v123/abc123.jpg
 *         coverImage:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               example: coverImages/xyz456
 *             secure_url:
 *               type: string
 *               example: https://res.cloudinary.com/demo/image/upload/v456/xyz456.jpg
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-04-21T14:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2024-04-21T15:00:00.000Z
 */
