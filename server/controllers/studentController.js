const Student = require('../models/Student');

// @desc    Get logged in student info
// @route   GET /api/student/me
// @access  Private
const getMyInfo = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id).select('-password');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMyInfo };
