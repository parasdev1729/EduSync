const express = require('express');
const router = express.Router();
const { getActivities } = require('../controllers/activityController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getActivities);

module.exports = router;
