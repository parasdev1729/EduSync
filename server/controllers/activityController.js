const Activity = require('../models/Activity');

// @desc    Get all activities
// @route   GET /api/activities
// @access  Private
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ date: -1 });
        res.status(200).json(activities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getActivities };
