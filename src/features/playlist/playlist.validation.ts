import Joi from 'joi';

export const createPlaylistSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'name is required',
    'string.min': 'name must be at least 3 characters long',
    'string.max': 'name cannot exceed 30 characters',
  }),
  description: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 3 characters long',
    'string.max': 'Description cannot exceed 100 characters',
  }),
});
