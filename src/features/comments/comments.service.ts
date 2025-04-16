import { IComments } from './comments.interface';
import Comments from './comments.model';

class commentsService {
  async getAllVideoComments(videoId: string): Promise<IComments[] | null> {
    return await Comments.find({ video: videoId }).populate({
      path: 'owner',
      select: 'username email avatar createdAt',
    });
  }
  async createNewComment(
    requestBody: Partial<IComments>,
  ): Promise<IComments | null> {
    return await Comments.create(requestBody);
  }

  async updateCommentById(
    commentId: string,
    requestBody: Partial<IComments>,
  ): Promise<IComments | null> {
    return await Comments.findOneAndUpdate({ _id: commentId }, requestBody, {
      new: true,
    });
  }

  async deleteCommentById(commentId: string): Promise<null> {
    return await Comments.findOneAndDelete({ _id: commentId }, { new: true });
  }
}

export default new commentsService();
