const Attendance = require('../models/Attendance');

// @desc    Get attendance for logged in student
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    try {
        const { session } = req.query;
        
        const query = { studentId: req.user.id };
        if (session) query.session = session;

        const attendance = await Attendance.find(query);
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAttendance };
