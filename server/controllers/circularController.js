const Circular = require('../models/Circular');

// @desc    Get all circulars
// @route   GET /api/circulars
// @access  Private
const getCirculars = async (req, res) => {
    try {
        const circulars = await Circular.find().select('-pdfData').sort({ date: -1 });
        res.status(200).json(circulars);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get circular PDF
// @route   GET /api/circulars/:id/pdf
// @access  Private
const getCircularPdf = async (req, res) => {
    try {
        const circular = await Circular.findById(req.params.id);
        if (!circular || !circular.pdfData) {
            return res.status(404).json({ message: 'PDF not found' });
        }

        res.setHeader('Content-Type', circular.pdfMimeType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${circular.pdfOriginalName || 'circular.pdf'}"`);
        res.send(circular.pdfData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { 
    getCirculars,
    getCircularPdf
};
