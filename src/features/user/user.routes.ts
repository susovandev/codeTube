import { Router } from 'express';
import userController from './user.controller';
import { asyncWrapper } from '../../utils/asyncWrapper';

const userRouter = Router();

userRouter.get('/signup', asyncWrapper(userController.createUser));

export default userRouter;
