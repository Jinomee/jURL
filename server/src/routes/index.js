const express = require('express');
const urlRoutes = require('./url.routes');
const authRoutes = require('./auth.routes');
const urlController = require('../controllers/url.controller');
const urlService = require('../services/url.service');

const router = express.Router();

// API routes
router.use('/api/urls', urlRoutes);
router.use('/api/admin', authRoutes);

// API redirect check endpoint - now enhanced to return the original URL
router.get('/api/redirect/:code', async (req, res, next) => {
  try {
    const { code } = req.params;
    
    // Find the URL but don't track clicks - we want this endpoint to be non-destructive
    const result = await urlService.getOriginalUrlWithStatus(code);
    
    if (!result.url) {
      return res.status(404).json({ 
        message: 'URL not found or has expired',
        reason: result.reason
      });
    }
    
    // Return the URL instead of redirecting
    res.json({ url: result.url });
  } catch (error) {
    next(error);
  }
});

// Redirect route - handles direct redirects
router.get('/:code', urlController.redirectToUrl);

module.exports = router;