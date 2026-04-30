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
        if (batch) query.batch = { $regex: batch, $options: 'i' };
        if (branch) query.branch = { $regex: branch, $options: 'i' };

        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
    try {
        const { userId, name, email, role, branch, semester, section, batch, department, phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ userId }, { email }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this ID or email' });
        }

        // Generate temporary password: firstName.toLowerCase() + '#' + userId
        const firstName = name.split(' ')[0].toLowerCase();
        const temporaryPassword = `${firstName}#${userId}`;

        const user = await User.create({
            userId,
            name,
            email,
            password: temporaryPassword,
            role,
            phone,
            branch,
            semester,
            section,
            batch,
            department
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                userId: user.userId,
                name: user.name,
                email: user.email,
                role: user.role,
                temporaryPassword // Return it so admin can give it to the user
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Create user error:', error);
        res.status(400).json({ message: error.message || 'Failed to create user' });
    }
};

module.exports = {
    getStats,
    getUsers,
    createUser
};
