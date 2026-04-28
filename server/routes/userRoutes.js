const express = require('express');
const router = express.Router();
const { getStats, getUsers } = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, authorize('admin'), getStats);
router.get('/', verifyToken, authorize('admin'), getUsers);

module.exports = router;
