import { Router } from 'express';
import { upload } from '../../middleware/multer.middleware';
import { validate } from '../../middleware/validation.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import authController from './auth.controller';
import { authMiddleware } from '../../middleware/auth.middleware';
import { createUserSchema, userLoginSchema } from '../user/user.validation';

const authRouter = Router();
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

authRouter.post(
  '/signin',
  validate(userLoginSchema),
  asyncWrapper(authController.loginUser),
);

authRouter.post(
  '/logout',
  asyncWrapper(authMiddleware),
  asyncWrapper(authController.logout),
);

authRouter.post(
  '/refresh-token',
  asyncWrapper(authController.refreshAccessToken),
);

export default authRouter;
