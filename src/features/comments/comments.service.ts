import { IComments } from './comments.interface';
import Comments from './comments.model';

class commentsService {
  async createNewComment(requestBody: Partial<IComments>) {
    return await Comments.create(requestBody);
  }
}

export default new commentsService();
