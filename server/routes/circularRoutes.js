const express = require('express');
const router = express.Router();
const { getCirculars } = require('../controllers/circularController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCirculars);

module.exports = router;
