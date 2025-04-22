import Joi from 'joi';

export const publishVideoSchema = Joi.object({
  title: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title cannot exceed 30 characters',
  }),
  description: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Description is required',
    'string.min': 'Description must be at least 3 characters long',
    'string.max': 'Description cannot exceed 100 characters',
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
  }),
});
