const mongoose = require('mongoose');

const circularSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    fileUrl: {
        type: String,
        default: ''
    },
    pdfData: {
        type: Buffer
    },
    pdfMimeType: {
        type: String
    },
    pdfOriginalName: {
        type: String
    },
    issuedBy: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Circular = mongoose.model('Circular', circularSchema);

module.exports = Circular;
