import Joi from 'joi';

export const createCommentSchema = Joi.object({
  comment: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Comment is required',
    'string.min': 'Comment must be at least 3 characters long',
    'string.max': 'Comment cannot exceed 100 characters',
  }),
});
