const express = require('express');
const router = express.Router();
const { getAttendance } = require('../controllers/attendanceController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAttendance);

module.exports = router;
