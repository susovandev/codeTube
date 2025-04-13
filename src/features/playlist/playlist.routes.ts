import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import playlistControllers from './playlist.controller';
import { validate } from '../../middleware/validation.middleware';
import { createPlaylistSchema } from './playlist.validation';
import { upload } from '../../middleware/multer.middleware';

const playlistRouter = Router();

playlistRouter.use(asyncWrapper(authMiddleware));

playlistRouter
  .route('/')
  .post(
    upload.single('playlistCoverImage'),
    validate(createPlaylistSchema),
    asyncWrapper(playlistControllers.createPlaylist),
  );
export default playlistRouter;
