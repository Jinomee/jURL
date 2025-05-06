const authService = require('../services/auth.service');
const logger = require('../utils/logger');

/**
 * Admin login
 */
const login = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    
    const token = await authService.login(password);
    
    if (!token) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    res.json({ token });
  } catch (error) {
    logger.error('Error during login:', error);
    next(error);
  }
};

module.exports = {
  login,
};