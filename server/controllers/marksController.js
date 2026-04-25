const Marks = require('../models/Marks');

// @desc    Get marks for logged in student
// @route   GET /api/marks
// @access  Private
const getMarks = async (req, res) => {
    try {
        const { session, examType } = req.query;
        
        const query = { studentId: req.user.id };
        if (session) query.session = session;
        if (examType) query.examType = examType;

        const marks = await Marks.find(query);
        res.status(200).json(marks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getMarks };
