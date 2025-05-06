const yup = require('yup');

// Create URL schema
const createUrlSchema = yup.object({
  originalUrl: yup.string()
    .url('Please enter a valid URL')
    .required('Original URL is required'),
  customCode: yup.string()
    .matches(/^[a-zA-Z0-9-_]*$/, 'Custom code can only contain letters, numbers, hyphens, and underscores')
    .min(3, 'Custom code must be at least 3 characters')
    .max(20, 'Custom code cannot exceed 20 characters')
    .nullable(),
  expireDuration: yup.object({
    value: yup.number().positive('Duration must be positive').integer('Duration must be an integer'),
    unit: yup.string().oneOf(['minutes', 'hours', 'days'], 'Unit must be minutes, hours, or days')
  }).nullable(),
});

// Update URL schema
const updateUrlSchema = yup.object({
  originalUrl: yup.string()
    .url('Please enter a valid URL'),
  expireDuration: yup.object({
    value: yup.number().positive('Duration must be positive').integer('Duration must be an integer'),
    unit: yup.string().oneOf(['minutes', 'hours', 'days'], 'Unit must be minutes, hours, or days')
  }).nullable(),
});

// Admin login schema
const loginSchema = yup.object({
  password: yup.string()
    .required('Password is required'),
});

// Pagination schema
const paginationSchema = yup.object({
  page: yup.number()
    .positive('Page must be a positive number')
    .integer('Page must be an integer')
    .default(1),
  limit: yup.number()
    .positive('Limit must be a positive number')
    .integer('Limit must be an integer')
    .max(100, 'Limit cannot exceed 100')
    .default(10),
});

module.exports = {
  createUrlSchema,
  updateUrlSchema,
  loginSchema,
  paginationSchema,
};