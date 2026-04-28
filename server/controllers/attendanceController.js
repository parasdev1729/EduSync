const Attendance = require('../models/Attendance');

// @desc    Get attendance (student gets own, teacher/admin gets specified)
// @route   GET /api/attendance
// @access  Private
const getAttendance = async (req, res) => {
    try {
        const { session, studentId } = req.query;
        
        const query = {};
        
        if (req.user.role === 'student') {
            query.studentId = req.user.id;
        } else if (studentId) {
            query.studentId = studentId;
        } else {
            return res.status(400).json({ message: 'studentId query param is required for teachers/admins' });
        }

        if (session) query.session = session;

        const attendance = await Attendance.find(query).populate('studentId', 'name userId branch batch');
        res.status(200).json(attendance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAttendance };
