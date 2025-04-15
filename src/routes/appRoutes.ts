import { Application } from 'express';
import userRouter from '../features/user/user.routes';
import authRouter from '../features/auth/auth.routes';
import videoRouter from '../features/video/video.routes';
import playlistRouter from '../features/playlist/playlist.routes';
import commentsRoutes from '../features/comments/comments.routes';

export const appRoutes = (app: Application) => {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/users', userRouter);
  app.use('/api/v1/videos', videoRouter);
  app.use('/api/v1/playlists', playlistRouter);
  app.use('/api/v1/comments', commentsRoutes);
};
