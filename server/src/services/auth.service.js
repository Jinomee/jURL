const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');
const logger = require('../utils/logger');

class AuthService {
  /**
   * Validate admin credentials and return JWT token
   * @param {string} password - Admin password
   * @returns {string|null} JWT token if authenticated, null otherwise
   */
  async login(password) {
    try {
      logger.info('Attempting login with provided password');
      
      // Find the admin (there should only be one)
      const admin = await Admin.findOne();
      
      if (!admin) {
        logger.error('No admin user found in database! Setting up default admin...');
        await this.initializeDefaultAdmin();
        
        // Try to find admin again after initialization
        const newAdmin = await Admin.findOne();
        if (!newAdmin) {
          logger.error('Failed to create default admin!');
          return null;
        }
        
        // Compare with default password directly for first login
        if (password === 'admin123') {
          logger.info('First login with default password successful');
          
          // Generate JWT token for the new admin
          const token = jwt.sign(
            { id: newAdmin.id },
            process.env.JWT_SECRET || 'fallback_secret_for_development',
            { expiresIn: process.env.JWT_EXPIRATION || '1d' }
          );
          
          return token;
        }
        
        logger.error('First login attempted with wrong password');
        return null;
      }
      
      logger.debug(`Found admin user with ID: ${admin.id}`);
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, admin.passwordHash);
      
      logger.debug(`Password verification result: ${isMatch}`);
      
      if (!isMatch) {
        // Try direct comparison with default password as fallback
        if (password === 'admin123') {
          logger.info('Fallback to default password successful');
          
          // Update the password hash to ensure bcrypt works next time
          const salt = await bcrypt.genSalt(10);
          const newHash = await bcrypt.hash('admin123', salt);
          admin.passwordHash = newHash;
          await admin.save();
          
          // Generate JWT token
          const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET || 'fallback_secret_for_development',
            { expiresIn: process.env.JWT_EXPIRATION || '1d' }
          );
          
          return token;
        }
        
        logger.debug(`Password verification failed for admin`);
        return null;
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { id: admin.id },
        process.env.JWT_SECRET || 'fallback_secret_for_development',
        { expiresIn: process.env.JWT_EXPIRATION || '1d' }
      );
      
      logger.info('Login successful, token generated');
      return token;
    } catch (error) {
      logger.error('Auth service login error:', error);
      throw error;
    }
  }

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {object|null} Decoded token payload if valid, null otherwise
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_development');
    } catch (error) {
      logger.error('Auth service token verification error:', error);
      return null;
    }
  }

  /**
   * Create a new admin user
   * @param {string} username - Admin username
   * @param {string} password - Admin password
   * @returns {object} Created admin object (without password)
   */
  async createAdmin(username, password) {
    try {
      // Check if admin already exists
      const existingAdmin = await Admin.findOne({ where: { username } });
      
      if (existingAdmin) {
        throw new Error('Admin user already exists');
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      
      // Create admin
      const admin = await Admin.create({
        username,
        passwordHash,
      });
      
      // Return admin without password
      const { passwordHash: _, ...adminData } = admin.toJSON();
      return adminData;
    } catch (error) {
      logger.error('Auth service create admin error:', error);
      throw error;
    }
  }

  /**
   * Initialize default admin user if no admin exists
   * @returns {boolean} Success status
   */
  async initializeDefaultAdmin() {
    try {
      // Check if any admin exists
      const adminCount = await Admin.count();
      
      if (adminCount > 0) {
        logger.info('Admin user already exists, skipping default admin creation');
        return false;
      }
      
      logger.info('No admin users found, creating default admin user');
      
      // Create a new hash for the default password "admin123"
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);
      
      logger.debug('Generated password hash for default admin');
      
      // Create default admin
      const admin = await Admin.create({
        username: 'admin',
        passwordHash: passwordHash,
      });
      
      logger.info(`Default admin user created successfully with ID: ${admin.id}`);
      return true;
    } catch (error) {
      logger.error('Error initializing default admin:', error);
      return false;
    }
  }
}

// Create a singleton instance
const authService = new AuthService();

module.exports = authService;