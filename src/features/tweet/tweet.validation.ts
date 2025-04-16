import Joi from 'joi';

export const createTweetSchema = Joi.object({
  content: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Tweet is required',
    'string.min': 'Tweet must be at least 3 characters long',
    'string.max': 'Tweet cannot exceed 100 characters',
  }),
});

export const updateTweetSchema = Joi.object({
  content: Joi.string().min(3).max(100).messages({
    'string.empty': 'Tweet is required',
    'string.min': 'Tweet must be at least 3 characters long',
    'string.max': 'Tweet cannot exceed 100 characters',
  }),
}).or('content');
