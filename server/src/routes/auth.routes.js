const express = require('express');
const { validateBody } = require('../middleware/validation.middleware');
const { loginSchema } = require('../utils/validators');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', validateBody(loginSchema), authController.login);

module.exports = router;