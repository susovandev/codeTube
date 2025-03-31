import { Application } from 'express';
import userRouter from '../features/user/user.routes';

export const appRoutes = (app: Application) => {
  app.use('/api/v1/users', userRouter);
};
