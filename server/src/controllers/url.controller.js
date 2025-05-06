const urlService = require('../services/url.service');
const logger = require('../utils/logger');

/**
 * Create a new shortened URL
 */
const createUrl = async (req, res, next) => {
  try {
    const { originalUrl, customCode, expireDuration } = req.body;
    
    const url = await urlService.createUrl({
      originalUrl,
      customCode,
      expireDuration,
    });
    
    // Always use headers for proper URL construction
    const host = req.get('X-Forwarded-Host') || req.get('host');
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    
    res.status(201).json({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${baseUrl}/${url.shortCode}`,
      expiresAt: url.expiresAt,
      createdAt: url.createdAt,
    });
  } catch (error) {
    logger.error('Error creating URL:', error);
    next(error);
  }
};

/**
 * Redirect to the original URL from a short code
 */
const redirectToUrl = async (req, res, next) => {
  try {
    const { code } = req.params;
    
    // Set cache control headers to prevent caching of the redirect
    res.set({
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Surrogate-Control': 'no-store'
    });
    
    // Use trackClick instead of getOriginalUrlWithStatus for more explicit click tracking
    const result = await urlService.trackClick(code);
    
    if (!result.url) {
      // Always use headers for proper URL construction
      const host = req.get('X-Forwarded-Host') || req.get('host');
      const protocol = req.get('X-Forwarded-Proto') || req.protocol;
      const baseUrl = `${protocol}://${host}`;
      const reason = result.reason;
      
      if (reason === 'expired') {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Expired</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                padding: 40px;
                text-align: center;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .icon {
                font-size: 64px;
                color: #ff9800;
                margin-bottom: 24px;
              }
              h1 {
                color: #333;
                margin-bottom: 16px;
              }
              p {
                color: #666;
                margin-bottom: 24px;
              }
              .code {
                font-family: monospace;
                background-color: #f5f5f5;
                padding: 4px 8px;
                border-radius: 4px;
              }
              .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 24px 0;
              }
              .btn {
                display: inline-block;
                background-color: #1976d2;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                transition: background-color 0.2s;
              }
              .btn:hover {
                background-color: #1565c0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">⏱️</div>
              <h1>Link Has Expired</h1>
              <p>
                The shortened link you're trying to access has expired and is no longer available.
                <br>
                <span style="font-style: italic; display: block; margin-top: 8px;">
                  Expired link: <span class="code">${code}</span>
                </span>
              </p>
              <div class="divider"></div>
              <p style="font-size: 14px;">Would you like to create a new shortened URL?</p>
              <a href="${baseUrl}" class="btn">Create New Short URL</a>
            </div>
          </body>
          </html>
        `);
      } else {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Link Not Found</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              .container {
                max-width: 600px;
                padding: 40px;
                text-align: center;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .icon {
                font-size: 64px;
                color: #f44336;
                margin-bottom: 24px;
              }
              h1 {
                color: #333;
                margin-bottom: 16px;
              }
              p {
                color: #666;
                margin-bottom: 24px;
              }
              .code {
                font-family: monospace;
                background-color: #f5f5f5;
                padding: 4px 8px;
                border-radius: 4px;
              }
              .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 24px 0;
              }
              .btn {
                display: inline-block;
                background-color: #1976d2;
                color: white;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 4px;
                font-weight: bold;
                transition: background-color 0.2s;
              }
              .btn:hover {
                background-color: #1565c0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">🔗</div>
              <h1>Link Not Found</h1>
              <p>
                The shortened link you're trying to access doesn't exist or may have been removed.
                <br>
                <span style="font-style: italic; display: block; margin-top: 8px;">
                  Requested link: <span class="code">${code}</span>
                </span>
              </p>
              <div class="divider"></div>
              <p style="font-size: 14px;">Would you like to create a new shortened URL?</p>
              <a href="${baseUrl}" class="btn">Create New Short URL</a>
            </div>
          </body>
          </html>
        `);
      }
    }
    
    // Redirect to the original URL
    res.redirect(result.url);
  } catch (error) {
    logger.error('Error redirecting to URL:', error);
    next(error);
  }
};

/**
 * Get all URLs with pagination (admin only)
 */
const getAllUrls = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    
    const result = await urlService.getAllUrls(
      parseInt(page) || 1,
      parseInt(limit) || 10
    );
    
    // Always use headers for proper URL construction
    const host = req.get('X-Forwarded-Host') || req.get('host');
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    
    // Add short URL to each URL in the result
    const urls = result.urls.map(url => ({
      ...url.toJSON(),
      shortUrl: `${baseUrl}/${url.shortCode}`,
    }));
    
    res.json({
      ...result,
      urls,
    });
  } catch (error) {
    logger.error('Error getting all URLs:', error);
    next(error);
  }
};

/**
 * Get a URL by ID (admin only)
 */
const getUrlById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const url = await urlService.getUrlById(id);
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    
    // Always use headers for proper URL construction
    const host = req.get('X-Forwarded-Host') || req.get('host');
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    
    res.json({
      ...url.toJSON(),
      shortUrl: `${baseUrl}/${url.shortCode}`,
    });
  } catch (error) {
    logger.error('Error getting URL by ID:', error);
    next(error);
  }
};

/**
 * Update a URL by ID (admin only)
 */
const updateUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { originalUrl, expireDuration } = req.body;
    
    const url = await urlService.updateUrl(id, {
      originalUrl,
      expireDuration,
    });
    
    // Always use headers for proper URL construction
    const host = req.get('X-Forwarded-Host') || req.get('host');
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    
    res.json({
      ...url.toJSON(),
      shortUrl: `${baseUrl}/${url.shortCode}`,
    });
  } catch (error) {
    logger.error('Error updating URL:', error);
    next(error);
  }
};

/**
 * Delete a URL by ID (admin only)
 */
const deleteUrl = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await urlService.deleteUrl(id);
    
    res.json({ message: 'URL deleted successfully' });
  } catch (error) {
    logger.error('Error deleting URL:', error);
    next(error);
  }
};

/**
 * Get URL statistics (admin only)
 */
const getUrlStats = async (req, res, next) => {
  try {
    const stats = await urlService.getUrlStats();
    res.json(stats);
  } catch (error) {
    logger.error('Error getting URL statistics:', error);
    next(error);
  }
};

/**
 * Refresh a URL's statistics directly from the database (admin only)
 */
const refreshUrlStats = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Bypass any caching and refresh from the database
    const url = await urlService.refreshUrlStats(id);
    
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }
    
    // Always use headers for proper URL construction
    const host = req.get('X-Forwarded-Host') || req.get('host');
    const protocol = req.get('X-Forwarded-Proto') || req.protocol;
    const baseUrl = `${protocol}://${host}`;
    
    res.json({
      ...url.toJSON(),
      shortUrl: `${baseUrl}/${url.shortCode}`,
    });
  } catch (error) {
    logger.error('Error refreshing URL stats:', error);
    next(error);
  }
};

module.exports = {
  createUrl,
  redirectToUrl,
  getAllUrls,
  getUrlById,
  updateUrl,
  deleteUrl,
  getUrlStats,
  refreshUrlStats,
};