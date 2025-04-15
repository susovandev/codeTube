import { IComments } from './comments.interface';
import Comments from './comments.model';

class commentsService {
  async createNewComment(requestBody: Partial<IComments>) {
    return await Comments.create(requestBody);
  }

  async updateCommentById(commentId: string, requestBody: Partial<IComments>) {
    return await Comments.findOneAndUpdate({ _id: commentId }, requestBody, {
      new: true,
    });
  }
}

export default new commentsService();
