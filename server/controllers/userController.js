const User = require('../models/User');
const Request = require('../models/Request');

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalTeachers = await User.countDocuments({ role: 'teacher' });
        const pendingRequests = await Request.countDocuments({ status: 'pending' });

        res.status(200).json({
            totalUsers,
            totalStudents,
            totalTeachers,
            pendingRequests,
            systemHealth: 'Optimal'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all users (with optional filtering)
// @route   GET /api/users
// @access  Private (Admin)
const getUsers = async (req, res) => {
    try {
        const { role, batch, branch } = req.query;
        const query = {};
        if (role) query.role = role;
        if (batch) query.batch = batch;
        if (branch) query.branch = branch;

        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getStats,
    getUsers
};
