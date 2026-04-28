const express = require('express');
const router = express.Router();
const {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequestStatus
} = require('../controllers/requestController');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Teacher routes
router.post('/', authorize('teacher'), createRequest);
router.get('/me', authorize('teacher'), getMyRequests);

// Admin routes
router.get('/', authorize('admin'), getRequests);
router.put('/:id/status', authorize('admin'), updateRequestStatus);

module.exports = router;
