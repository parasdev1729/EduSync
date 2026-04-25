const express = require('express');
const router = express.Router();
const { getMarks } = require('../controllers/marksController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMarks);

module.exports = router;
