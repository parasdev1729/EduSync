const Request = require('../models/Request');
const Circular = require('../models/Circular');
const Attendance = require('../models/Attendance');

// @desc    Create a new request
// @route   POST /api/requests
// @access  Private (Teacher)
const createRequest = async (req, res) => {
    try {
        const { type, payload, targetId } = req.body;
        
        const request = await Request.create({
            requester: req.user.id,
            type,
            payload,
            targetId
        });

        const io = req.app.get('io');
        io.to('admins').emit('new_request', request);

        res.status(201).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Admin)
const getRequests = async (req, res) => {
    try {
        const { status, type } = req.query;
        const query = {};
        if (status) query.status = status;
        if (type) query.type = type;

        const requests = await Request.find(query).populate('requester', 'name email role');
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my requests
// @route   GET /api/requests/me
// @access  Private (Teacher)
const getMyRequests = async (req, res) => {
    try {
        const requests = await Request.find({ requester: req.user.id });
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update request status
// @route   PUT /api/requests/:id/status
// @access  Private (Admin)
const updateRequestStatus = async (req, res) => {
    try {
        const { status, adminComment } = req.body;
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        request.status = status;
        if (adminComment) request.adminComment = adminComment;

        const io = req.app.get('io');

        if (status === 'approved') {
            if (request.type === 'circular') {
                // Logic to create a circular
                const { title, description, fileUrl, issuedBy, batch } = request.payload;
                const newCircular = await Circular.create({
                    title,
                    description,
                    fileUrl,
                    issuedBy: issuedBy || 'Admin'
                });

                // Emit new circular event
                if (batch) {
                    io.to(`batch:${batch}`).emit('new_circular', newCircular);
                } else {
                    io.to('students').emit('new_circular', newCircular);
                }
            } else if (request.type === 'attendance_update') {
                // Logic to update attendance
                let attendance;
                if (request.targetId) {
                    attendance = await Attendance.findByIdAndUpdate(request.targetId, request.payload, { new: true });
                } else {
                    attendance = await Attendance.create(request.payload);
                }
                
                // Emit attendance change event to student
                if (attendance && attendance.studentId) {
                    io.to(`user:${attendance.studentId}`).emit('attendance_changed', attendance);
                }
            }
        }

        await request.save();

        // Emit status update to the requester
        io.to(`user:${request.requester}`).emit('request_status_update', request);

        res.status(200).json(request);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequestStatus
};
