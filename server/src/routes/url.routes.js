const express = require('express');
const { validateBody, validateQuery } = require('../middleware/validation.middleware');
const { authenticateAdmin } = require('../middleware/auth.middleware');
const { createUrlSchema, updateUrlSchema, paginationSchema } = require('../utils/validators');
const urlController = require('../controllers/url.controller');

const router = express.Router();

// Public endpoints
router.post('/', validateBody(createUrlSchema), urlController.createUrl);

// Admin-only endpoints
router.get('/', 
  authenticateAdmin, 
  validateQuery(paginationSchema), 
  urlController.getAllUrls
);

router.get('/stats', 
  authenticateAdmin, 
  urlController.getUrlStats
);

router.get('/refresh/:id', 
  authenticateAdmin, 
  urlController.refreshUrlStats
);

router.get('/:id', 
  authenticateAdmin, 
  urlController.getUrlById
);

router.put('/:id', 
  authenticateAdmin, 
  validateBody(updateUrlSchema), 
  urlController.updateUrl
);

router.delete('/:id', 
  authenticateAdmin, 
  urlController.deleteUrl
);

module.exports = router;