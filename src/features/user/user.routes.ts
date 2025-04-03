import { Router } from 'express';
import userController from './user.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { upload } from '../../middleware/multer.middleware';
import { validate } from '../../middleware/validation.middleware';
import { createUserSchema, userLoginSchema } from './user.validation';
import { authMiddleware } from '../../middleware/auth.middleware';

const userRouter = Router();

userRouter.post(
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
  asyncWrapper(userController.createUser),
);

userRouter.post(
  '/signin',
  validate(userLoginSchema),
  asyncWrapper(userController.loginUser),
);

userRouter.post(
  '/logout',
  asyncWrapper(authMiddleware),
  asyncWrapper(userController.logout),
);

export default userRouter;
