const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
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
    examType: {
        type: String,
        enum: ["MST1", "MST2", "EndSem"],
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    maxMarks: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        default: 4
    }
}, {
    timestamps: true
});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
