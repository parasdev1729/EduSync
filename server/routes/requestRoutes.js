const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequestStatus,
    getRequestPdf
} = require('../controllers/requestController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(verifyToken);

// Teacher routes
router.post('/', authorize('teacher'), (req, res, next) => {
    upload.single('pdf')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, createRequest);
router.get('/me', authorize('teacher'), getMyRequests);

// Secure PDF viewer route for a specific request
router.get('/:id/pdf', getRequestPdf);

// Admin routes
router.get('/', authorize('admin'), getRequests);
router.put('/:id/status', authorize('admin'), updateRequestStatus);

module.exports = router;
