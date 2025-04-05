import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
  }),
  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    })
    .required(),
  fullName: Joi.string().min(3).max(50).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
  }),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
      ),
    )
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 30 characters',
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    })
    .required(),
});

export const userLoginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
  }),
  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    })
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
      ),
    )
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 30 characters',
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    })
    .required(),
});

export const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username cannot exceed 30 characters',
  }),

  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    }),

  fullName: Joi.string().min(3).max(50).messages({
    'string.empty': 'Full name is required',
    'string.min': 'Full name must be at least 3 characters long',
    'string.max': 'Full name cannot exceed 50 characters',
  }),
}).or('username', 'email', 'fullName');

export const forgetPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'))
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Invalid email format',
    })
    .required(),
});

export const updatePasswordSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(30)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$',
      ),
    )
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 30 characters',
      'string.pattern.base':
        'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    })
    .required(),
});
