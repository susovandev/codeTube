import { Router } from 'express';
import { asyncWrapper } from '../../utils/asyncWrapper';
import videoControllers from './video.controllers';
import { upload } from '../../middleware/multer.middleware';
import { validate } from '../../middleware/validation.middleware';
import { publishVideoSchema } from './video.validation.';
import { authMiddleware } from '../../middleware/auth.middleware';
import videoServices from './video.services';

const videoRouter = Router();

videoRouter.use(asyncWrapper(authMiddleware));

videoRouter.post(
  '/upload',
  upload.fields([
    {
      name: 'video',
      maxCount: 1,
    },
    {
      name: 'thumbnail',
      maxCount: 1,
    },
  ]),
  validate(publishVideoSchema),
  asyncWrapper(videoControllers.publishVideo),
);

videoRouter
  .route('/:videoId')
  .get(asyncWrapper(videoControllers.getVideoById))
  .patch(
    upload.single('thumbnail'),
    asyncWrapper(videoControllers.updateVideoById),
  )
  .delete(asyncWrapper(videoControllers.deleteVideoById));

videoRouter
  .route('/toggle/publish/:videoId')
  .patch(videoControllers.togglePublishStatus);

export default videoRouter;
