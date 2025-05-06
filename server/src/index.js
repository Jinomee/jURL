require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const routes = require('./routes');
const db = require('./models');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');
const authService = require('./services/auth.service');
const urlService = require('./services/url.service');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use('/api/', apiLimiter);

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set view engine for error pages
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Use routes
app.use(routes);

// Handle 404 errors
app.use(notFoundHandler);

// Handle errors
app.use(errorHandler);

// Set up scheduled tasks
const setupScheduledTasks = () => {
  // Clean up expired URLs every day
  setInterval(async () => {
    try {
      const deletedCount = await urlService.cleanupExpiredUrls();
      logger.info(`Cleaned up ${deletedCount} expired URLs`);
    } catch (error) {
      logger.error('Error cleaning up expired URLs:', error);
    }
  }, 24 * 60 * 60 * 1000);
};

// Start the server
const startServer = async () => {
  try {
    // Sync database
    await db.sequelize.sync();
    logger.info('Database synchronized successfully');

    // Initialize default admin if needed
    await authService.initializeDefaultAdmin();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Set up scheduled tasks
    setupScheduledTasks();
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();