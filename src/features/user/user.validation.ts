import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
    .required(),
  fullName: Joi.string().min(3).max(50).required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
      ),
    )
    .message(
      'Password must have at least 6 characters, one uppercase letter, one lowercase letter, one number, and one special character',
    )
    .required(),
});
