const authService = require('../services/auth.service');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate admin user
 */
const authenticateAdmin = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      logger.debug('No Authorization header provided');
      return res.status(401).json({ message: 'Authorization token is required' });
    }
    
    if (!authHeader.startsWith('Bearer ')) {
      logger.debug('Authorization header does not use Bearer scheme');
      return res.status(401).json({ message: 'Invalid authorization format, Bearer token required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      logger.debug('Empty token provided');
      return res.status(401).json({ message: 'Authorization token is empty' });
    }
    
    // Verify token
    const decoded = authService.verifyToken(token);
    
    if (!decoded) {
      logger.debug('Token verification failed');
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    
    // Add admin data to request object
    req.admin = decoded;
    logger.debug(`Authenticated admin with ID: ${decoded.id}`);
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed: ' + error.message });
  }
};

module.exports = {
  authenticateAdmin,
};