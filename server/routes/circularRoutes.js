const express = require('express');
const router = express.Router();
const { getCirculars, getCircularPdf } = require('../controllers/circularController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getCirculars);
router.get('/:id/pdf', verifyToken, getCircularPdf);

module.exports = router;
