const Circular = require('../models/Circular');

// @desc    Get all circulars
// @route   GET /api/circulars
// @access  Private
const getCirculars = async (req, res) => {
    try {
        const circulars = await Circular.find().sort({ date: -1 });
        res.status(200).json(circulars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getCirculars };
