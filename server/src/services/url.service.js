const { nanoid } = require('nanoid');
const { Url } = require('../models');
const redisService = require('./redis.service');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

class UrlService {
  /**
   * Generate a unique short code
   * @param {number} length - Length of the short code to generate
   * @returns {string} Generated short code
   */
  async generateUniqueCode(length = process.env.URL_CODE_LENGTH || 6) {
    const maxAttempts = 5;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const shortCode = nanoid(parseInt(length));
      
      // Check if the code exists in the database
      const existingUrl = await Url.findOne({ where: { shortCode } });
      
      if (!existingUrl) {
        return shortCode;
      }
      
      attempts++;
    }
    
    throw new Error('Failed to generate a unique short code after multiple attempts');
  }

  /**
   * Validate a custom short code
   * @param {string} code - The custom short code to validate
   * @returns {object} Validation result with status and message
   */
  async validateCustomCode(code) {
    // Check if code is empty
    if (!code || code.trim() === '') {
      return { isValid: false, message: 'Custom code cannot be empty' };
    }
    
    // Check if code contains only allowed characters (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9-_]+$/.test(code)) {
      return { 
        isValid: false, 
        message: 'Custom code can only contain letters, numbers, hyphens, and underscores' 
      };
    }
    
    // Check if code length is within limits (3-20 characters)
    if (code.length < 3 || code.length > 20) {
      return { 
        isValid: false, 
        message: 'Custom code must be between 3 and 20 characters long' 
      };
    }
    
    // Check if code is already in use
    const existingUrl = await Url.findOne({ where: { shortCode: code } });
    if (existingUrl) {
      return { isValid: false, message: 'This custom code is already in use' };
    }
    
    return { isValid: true };
  }

  /**
   * Calculate expiration date from duration
   * @param {object} expireDuration - Duration object with value and unit
   * @returns {Date|null} - Calculated expiration date or null if no duration
   */
  calculateExpirationDate(expireDuration) {
    if (!expireDuration || !expireDuration.value || !expireDuration.unit) {
      return null;
    }

    const now = new Date();
    const { value, unit } = expireDuration;

    switch (unit) {
      case 'minutes':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'hours':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'days':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        return null;
    }
  }

  /**
   * Create a new shortened URL
   * @param {object} urlData - The URL data object
   * @returns {object} The created URL object
   */
  async createUrl(urlData) {
    try {
      const { originalUrl, customCode, expireDuration } = urlData;
      
      let shortCode;
      let isCustom = false;
      
      if (customCode) {
        // Validate custom code
        const validation = await this.validateCustomCode(customCode);
        if (!validation.isValid) {
          // Create a more descriptive error that the middleware will handle properly
          const error = new Error(validation.message);
          // Add properties that the error middleware will recognize
          error.name = 'ValidationError';
          error.errors = { customCode: validation.message };
          throw error;
        }
        shortCode = customCode;
        isCustom = true;
      } else {
        // Generate a random short code
        shortCode = await this.generateUniqueCode();
      }
      
      // Calculate expiration date from duration if provided
      const expiresAt = this.calculateExpirationDate(expireDuration);
      
      // Create the URL record in the database
      const url = await Url.create({
        originalUrl,
        shortCode,
        expiresAt,
        isCustom,
      });
      
      // Store in Redis cache if there's an expiration
      if (expiresAt) {
        const expirationSeconds = Math.floor((new Date(expiresAt) - new Date()) / 1000);
        if (expirationSeconds > 0) {
          await redisService.setUrl(shortCode, {
            originalUrl,
            expiresAt,
          }, expirationSeconds);
        }
      } else {
        // Cache with default expiration (24 hours)
        await redisService.setUrl(shortCode, {
          originalUrl,
          expiresAt: null,
        }, 86400); // 24 hours in seconds
      }
      
      return url;
    } catch (error) {
      logger.error('Error creating URL:', error);
      throw error;
    }
  }

  /**
   * Retrieve the original URL from a short code with status information
   * @param {string} shortCode - The short code to look up
   * @returns {object} Object containing the URL and status information
   */
  async getOriginalUrlWithStatus(shortCode) {
    try {
      // Try to get the URL from Redis cache first
      const cachedUrl = await redisService.getUrl(shortCode);
      
      if (cachedUrl) {
        // Check if the URL has expired
        if (cachedUrl.expiresAt && new Date(cachedUrl.expiresAt) < new Date()) {
          // URL has expired, remove from cache
          await redisService.deleteUrl(shortCode);
          return { url: null, reason: 'expired' };
        }
        
        // Update click count in the database asynchronously
        // We need to make sure this completes, so wrap it in a try-catch
        try {
          await this.incrementClickCount(shortCode);
          logger.info(`Click count incremented for cached URL: ${shortCode}`);
        } catch (clickError) {
          logger.error(`Failed to increment click count for cached URL: ${shortCode}`, clickError);
          // Continue even if click tracking fails
        }
        
        return { url: cachedUrl.originalUrl, reason: null };
      }
      
      // If not in cache, query the database to check if it exists but expired
      const expiredUrl = await Url.findOne({
        where: { 
          shortCode,
          expiresAt: { [Op.lt]: new Date() }
        }
      });
      
      if (expiredUrl) {
        return { url: null, reason: 'expired' };
      }
      
      // Check if URL exists but not expired
      const url = await Url.findOne({ 
        where: { 
          shortCode,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        } 
      });
      
      if (!url) {
        return { url: null, reason: 'not_found' };
      }
      
      // Update click count
      await this.incrementClickCount(shortCode);
      
      // Cache the result for future requests
      const expirationSeconds = url.expiresAt 
        ? Math.floor((new Date(url.expiresAt) - new Date()) / 1000)
        : 86400;
      
      if (expirationSeconds > 0) {
        await redisService.setUrl(shortCode, {
          originalUrl: url.originalUrl,
          expiresAt: url.expiresAt,
        }, expirationSeconds);
      }
      
      return { url: url.originalUrl, reason: null };
    } catch (error) {
      logger.error('Error getting original URL with status:', error);
      throw error;
    }
  }

  /**
   * Increment the click count for a URL
   * @param {string} shortCode - The short code of the URL
   */
  async incrementClickCount(shortCode) {
    try {
      await Url.update(
        { clickCount: Url.sequelize.literal('clickCount + 1') },
        { where: { shortCode } }
      );
    } catch (error) {
      logger.error('Error incrementing click count:', error);
      throw error;
    }
  }

  /**
   * Get all URLs with pagination
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Number of items per page
   * @returns {object} Paginated list of URLs
   */
  async getAllUrls(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Url.findAndCountAll({
        order: [['createdAt', 'DESC']],
        limit,
        offset,
      });
      
      return {
        urls: rows,
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error('Error getting all URLs:', error);
      throw error;
    }
  }

  /**
   * Get a URL by ID
   * @param {string} id - The URL ID
   * @returns {object|null} The URL object or null if not found
   */
  async getUrlById(id) {
    try {
      return await Url.findByPk(id);
    } catch (error) {
      logger.error('Error getting URL by ID:', error);
      throw error;
    }
  }

  /**
   * Update a URL by ID
   * @param {string} id - The URL ID
   * @param {object} urlData - The new URL data
   * @returns {object} The updated URL object
   */
  async updateUrl(id, urlData) {
    try {
      const url = await Url.findByPk(id);
      
      if (!url) {
        throw new Error('URL not found');
      }
      
      // Calculate expiration date from duration if provided
      if (urlData.expireDuration) {
        urlData.expiresAt = this.calculateExpirationDate(urlData.expireDuration);
        // Delete expireDuration as it's not a field in the database
        delete urlData.expireDuration;
      }
      
      // Update with new data
      Object.assign(url, urlData);
      await url.save();
      
      // Update or remove from cache
      if (url.expiresAt) {
        const expirationSeconds = Math.floor((new Date(url.expiresAt) - new Date()) / 1000);
        
        if (expirationSeconds > 0) {
          await redisService.setUrl(url.shortCode, {
            originalUrl: url.originalUrl,
            expiresAt: url.expiresAt,
          }, expirationSeconds);
        } else {
          // If already expired, remove from cache
          await redisService.deleteUrl(url.shortCode);
        }
      } else {
        // No expiration, cache with default expiration
        await redisService.setUrl(url.shortCode, {
          originalUrl: url.originalUrl,
          expiresAt: null,
        }, 86400); // 24 hours
      }
      
      return url;
    } catch (error) {
      logger.error('Error updating URL:', error);
      throw error;
    }
  }

  /**
   * Delete a URL by ID
   * @param {string} id - The URL ID
   * @returns {boolean} Success status
   */
  async deleteUrl(id) {
    try {
      const url = await Url.findByPk(id);
      
      if (!url) {
        throw new Error('URL not found');
      }
      
      // Remove from cache
      await redisService.deleteUrl(url.shortCode);
      
      // Delete from database
      await url.destroy();
      
      return true;
    } catch (error) {
      logger.error('Error deleting URL:', error);
      throw error;
    }
  }

  /**
   * Clean up expired URLs
   * @returns {number} Number of deleted URLs
   */
  async cleanupExpiredUrls() {
    try {
      const expiredUrls = await Url.findAll({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });
      
      // Delete from cache
      for (const url of expiredUrls) {
        await redisService.deleteUrl(url.shortCode);
      }
      
      // Delete from database
      const result = await Url.destroy({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
          },
        },
      });
      
      return result;
    } catch (error) {
      logger.error('Error cleaning up expired URLs:', error);
      throw error;
    }
  }

  /**
   * Track a click for a URL and return the original URL
   * @param {string} shortCode - The short code of the URL to track
   * @returns {Promise<object>} Object containing URL and status information
   */
  async trackClick(shortCode) {
    try {
      logger.info(`Tracking click for URL: ${shortCode}`);
      
      // First check if the URL exists
      const url = await Url.findOne({ 
        where: { 
          shortCode,
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        } 
      });
      
      if (!url) {
        logger.info(`URL not found or expired: ${shortCode}`);
        
        // Check if it's expired specifically
        const expiredUrl = await Url.findOne({
          where: { 
            shortCode,
            expiresAt: { [Op.lt]: new Date() }
          }
        });
        
        if (expiredUrl) {
          return { url: null, reason: 'expired' };
        }
        
        return { url: null, reason: 'not_found' };
      }
      
      // Increment the click count directly
      logger.info(`Incrementing click count for URL: ${shortCode}`);
      
      // Use a transaction to ensure the update is completed
      const transaction = await Url.sequelize.transaction();
      try {
        await Url.update(
          { clickCount: Url.sequelize.literal('clickCount + 1') },
          { 
            where: { shortCode },
            transaction
          }
        );
        
        await transaction.commit();
        logger.info(`Click count incremented successfully for: ${shortCode}`);
      } catch (error) {
        await transaction.rollback();
        logger.error(`Failed to increment click count for: ${shortCode}`, error);
        // Continue with redirect even if click tracking fails
      }
      
      // Return the original URL
      return { url: url.originalUrl, reason: null };
    } catch (error) {
      logger.error('Error tracking click:', error);
      throw error;
    }
  }

  /**
   * Get URL statistics
   * @returns {Promise<object>} Statistics about all URLs
   */
  async getUrlStats() {
    try {
      // Get total count
      const totalUrls = await Url.count();
      
      // Get expired URLs count
      const expiredUrls = await Url.count({
        where: {
          expiresAt: {
            [Op.lt]: new Date(),
            [Op.ne]: null
          }
        }
      });
      
      // Get total clicks
      const [totalClicksResult] = await Url.sequelize.query(
        'SELECT SUM(\"clickCount\") as totalClicks FROM urls'
      );
      const totalClicks = totalClicksResult[0]?.totalClicks || 0;
      
      // Get active URLs (not expired)
      const activeUrls = await Url.count({
        where: {
          [Op.or]: [
            { expiresAt: null },
            { expiresAt: { [Op.gt]: new Date() } }
          ]
        }
      });
      
      return {
        totalUrls,
        expiredUrls,
        activeUrls,
        totalClicks: parseInt(totalClicks, 10)
      };
    } catch (error) {
      logger.error('Error getting URL statistics:', error);
      throw error;
    }
  }

  /**
   * Refresh a URL's statistics directly from the database
   * @param {string} id - The URL ID
   * @returns {object|null} The URL object with fresh data or null if not found
   */
  async refreshUrlStats(id) {
    try {
      // Force a direct database read without using cache
      await Url.sequelize.query('SELECT 1');  // Ensures connection is active
      
      const url = await Url.findByPk(id, {
        attributes: { 
          include: [[Url.sequelize.literal('clickCount'), 'clickCount']] 
        }
      });
      
      if (!url) {
        return null;
      }
      
      // Also refresh the cache if there is one
      if (url.shortCode) {
        await redisService.deleteUrl(url.shortCode);
        
        // Only cache it again if not expired
        if (!url.expiresAt || new Date(url.expiresAt) > new Date()) {
          const expirationSeconds = url.expiresAt 
            ? Math.floor((new Date(url.expiresAt) - new Date()) / 1000)
            : 86400;
            
          if (expirationSeconds > 0) {
            await redisService.setUrl(url.shortCode, {
              originalUrl: url.originalUrl,
              expiresAt: url.expiresAt,
            }, expirationSeconds);
          }
        }
      }
      
      return url;
    } catch (error) {
      logger.error('Error refreshing URL stats:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const urlService = new UrlService();

module.exports = urlService;