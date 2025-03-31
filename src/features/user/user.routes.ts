import { Router } from 'express';
import userController from './user.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';
import { validate } from '../../middleware/validation.middleware';
import { createUserSchema } from './user.validation';

const userRouter = Router();

userRouter.get(
  '/signup',
  validate(createUserSchema),
  asyncWrapper(userController.createUser),
);

export default userRouter;
