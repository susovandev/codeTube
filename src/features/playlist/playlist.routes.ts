import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { asyncWrapper } from '../../utils/asyncWrapper';
import playlistControllers from './playlist.controller';
import { validate } from '../../middleware/validation.middleware';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
} from './playlist.validation';
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

playlistRouter
  .route('/:playlistId')
  .get(asyncWrapper(playlistControllers.getPlaylistsById))
  .patch(
    upload.single('playlistCoverImage'),
    validate(updatePlaylistSchema),
    asyncWrapper(playlistControllers.updatePlaylistsById),
  )
  .delete(asyncWrapper(playlistControllers.deletePlaylistsById));

playlistRouter
  .route('/add/:videoId/:playlistId')
  .patch(asyncWrapper(playlistControllers.addVideoToPlaylist));

playlistRouter
  .route('/remove/:videoId/:playlistId')
  .patch(asyncWrapper(playlistControllers.removeVideoToPlaylist));

playlistRouter
  .route('/user/:userId')
  .get(asyncWrapper(playlistControllers.getUserPlaylists));
export default playlistRouter;
