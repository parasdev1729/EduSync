const Request = require('../models/Request');
const Circular = require('../models/Circular');
const Attendance = require('../models/Attendance');

// @desc    Create a new request
// @route   POST /api/requests
// @access  Private (Teacher)
const createRequest = async (req, res) => {
    try {
        let { type, payload, targetId } = req.body;
        
        // Handle multipart/form-data payload string
        if (typeof payload === 'string') {
            try {
                payload = JSON.parse(payload);
            } catch (err) {
                return res.status(400).json({ message: 'Invalid payload JSON format' });
            }
        }
        
        const requestData = {
            requester: req.user.id,
            type,
            payload,
            targetId
        };

        if (req.file) {
            requestData.pdfData = req.file.buffer;
            requestData.pdfMimeType = req.file.mimetype;
            requestData.pdfOriginalName = req.file.originalname;
        }

        const request = await Request.create(requestData);

        const io = req.app.get('io');
        const requestForSocket = request.toObject();
        if (requestForSocket.pdfData) {
            delete requestForSocket.pdfData;
            requestForSocket.hasPdf = true;
        }
        io.to('admins').emit('new_request', requestForSocket);

        const responseData = request.toObject();
        if (responseData.pdfData) {
            delete responseData.pdfData;
            responseData.hasPdf = true;
        }

        res.status(201).json(responseData);
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

        const requests = await Request.find(query).select('-pdfData').populate('requester', 'name email role');
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
        const requests = await Request.find({ requester: req.user.id }).select('-pdfData');
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
                    issuedBy: issuedBy || 'Admin',
                    pdfData: request.pdfData,
                    pdfMimeType: request.pdfMimeType,
                    pdfOriginalName: request.pdfOriginalName
                });

                // Emit new circular event (without PDF data buffer)
                const circularForSocket = newCircular.toObject();
                if (circularForSocket.pdfData) {
                    delete circularForSocket.pdfData;
                    circularForSocket.hasPdf = true;
                }

                if (batch) {
                    io.to(`batch:${batch}`).emit('new_circular', circularForSocket);
                } else {
                    io.to('students').emit('new_circular', circularForSocket);
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

        const requestResponse = request.toObject();
        if (requestResponse.pdfData) {
            delete requestResponse.pdfData;
            requestResponse.hasPdf = true;
        }

        // Emit status update to the requester (without PDF data buffer)
        io.to(`user:${request.requester}`).emit('request_status_update', requestResponse);

        res.status(200).json(requestResponse);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get request PDF document
// @route   GET /api/requests/:id/pdf
// @access  Private (Admin or Requester Teacher)
const getRequestPdf = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify authorization: admin or the teacher who made the request
        if (req.user.role !== 'admin' && request.requester.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this document' });
        }

        if (!request.pdfData) {
            return res.status(404).json({ message: 'PDF document not found in this request' });
        }

        res.setHeader('Content-Type', request.pdfMimeType || 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${request.pdfOriginalName || 'document.pdf'}"`);
        res.send(request.pdfData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createRequest,
    getRequests,
    getMyRequests,
    updateRequestStatus,
    getRequestPdf
};
