require('dotenv').config();

module.exports = {
  url: process.env.REDIS_URL || 
    `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  options: {
    maxRetriesPerRequest: 3,
    connectTimeout: 10000,
    retryStrategy: (times) => {
      // Retry connection with exponential backoff
      return Math.min(times * 50, 2000);
    },
  },
};