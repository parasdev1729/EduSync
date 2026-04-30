const express = require('express');
const router = express.Router();
const { getStats, getUsers, createUser } = require('../controllers/userController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/stats', verifyToken, authorize('admin'), getStats);
router.get('/', verifyToken, authorize('admin', 'teacher'), getUsers);
router.post('/', verifyToken, authorize('admin'), createUser);

module.exports = router;
