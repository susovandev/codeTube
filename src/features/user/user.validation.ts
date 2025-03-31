import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().required().min(3).trim(),
  email: Joi.string()
    .required()
    .email()
    .pattern(new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')),
  fullName: Joi.string().required().min(3),
  avatar: Joi.string().required(),
  coverImage: Joi.string().optional(),
  password: Joi.string().required().min(6),
});
