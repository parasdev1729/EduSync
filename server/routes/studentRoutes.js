const express = require('express');
const router = express.Router();
const { getMyInfo } = require('../controllers/studentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/me', verifyToken, getMyInfo);

module.exports = router;
