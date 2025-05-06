const Redis = require('ioredis');
const config = require('../config/redis');
const logger = require('../utils/logger');

class RedisService {
  constructor() {
    this.client = new Redis(config.url, config.options);

    this.client.on('connect', () => {
      logger.info('Redis client connected successfully');
    });

    this.client.on('error', (error) => {
      logger.error('Redis client error:', error);
    });
  }

  /**
   * Store a URL mapping in Redis cache
   * @param {string} shortCode - The short code to use as key
   * @param {object} urlData - The URL data to store
   * @param {number} expirationSeconds - Time to cache in seconds (optional)
   */
  async setUrl(shortCode, urlData, expirationSeconds = null) {
    try {
      const value = JSON.stringify(urlData);
      
      if (expirationSeconds) {
        await this.client.set(shortCode, value, 'EX', expirationSeconds);
      } else {
        await this.client.set(shortCode, value);
      }
      
      logger.debug(`Redis: Stored ${shortCode} in cache`);
      return true;
    } catch (error) {
      logger.error('Redis setUrl error:', error);
      return false;
    }
  }

  /**
   * Retrieve a URL mapping from Redis cache
   * @param {string} shortCode - The short code to look up
   * @returns {object|null} The URL data or null if not found
   */
  async getUrl(shortCode) {
    try {
      const value = await this.client.get(shortCode);
      
      if (!value) {
        logger.debug(`Redis: Cache miss for ${shortCode}`);
        return null;
      }
      
      logger.debug(`Redis: Cache hit for ${shortCode}`);
      return JSON.parse(value);
    } catch (error) {
      logger.error('Redis getUrl error:', error);
      return null;
    }
  }

  /**
   * Remove a URL mapping from Redis cache
   * @param {string} shortCode - The short code to remove
   */
  async deleteUrl(shortCode) {
    try {
      await this.client.del(shortCode);
      logger.debug(`Redis: Removed ${shortCode} from cache`);
      return true;
    } catch (error) {
      logger.error('Redis deleteUrl error:', error);
      return false;
    }
  }

  /**
   * Clear all data from Redis (use with caution)
   */
  async clearAll() {
    try {
      await this.client.flushdb();
      logger.info('Redis: Cache cleared');
      return true;
    } catch (error) {
      logger.error('Redis clearAll error:', error);
      return false;
    }
  }

  /**
   * Close the Redis connection
   */
  async close() {
    try {
      await this.client.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Redis close error:', error);
    }
  }
}

// Create a singleton instance
const redisService = new RedisService();

module.exports = redisService;