const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    session: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    totalClasses: {
        type: Number,
        required: true
    },
    attended: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
