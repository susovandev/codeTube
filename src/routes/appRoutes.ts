import { Application } from 'express';
import userRouter from '../features/user/user.routes';
import authRouter from '../features/auth/auth.routes';

export const appRoutes = (app: Application) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
};
