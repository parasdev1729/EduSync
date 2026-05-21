const multer = require('multer');

// Configure memory storage
const storage = multer.memoryStorage();

// Validate file type (only PDFs allowed)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB size limit
    }
});

module.exports = upload;
