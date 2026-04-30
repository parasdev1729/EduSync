const express = require('express');
const router = express.Router();
const { getAttendance, bulkUpdateAttendance } = require('../controllers/attendanceController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getAttendance);
router.post('/bulk', verifyToken, authorize('teacher'), bulkUpdateAttendance);

module.exports = router;
