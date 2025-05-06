const logger = require('../utils/logger');

/**
 * Middleware to validate request body against a schema
 * @param {object} schema - Yup validation schema
 */
const validateBody = (schema) => async (req, res, next) => {
  try {
    // Validate request body against schema
    const validData = await schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    // Replace request body with validated data
    req.body = validData;
    
    next();
  } catch (error) {
    logger.debug('Validation error:', error);
    
    // Format validation errors
    const errors = error.inner.reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});
    
    res.status(400).json({ 
      message: 'Validation failed',
      errors, 
    });
  }
};

/**
 * Middleware to validate query parameters against a schema
 * @param {object} schema - Yup validation schema
 */
const validateQuery = (schema) => async (req, res, next) => {
  try {
    // Validate query parameters against schema
    const validData = await schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });
    
    // Replace request query with validated data
    req.query = validData;
    
    next();
  } catch (error) {
    logger.debug('Query validation error:', error);
    
    // Format validation errors
    const errors = error.inner.reduce((acc, err) => {
      acc[err.path] = err.message;
      return acc;
    }, {});
    
    res.status(400).json({ 
      message: 'Query validation failed',
      errors, 
    });
  }
};

module.exports = {
  validateBody,
  validateQuery,
};