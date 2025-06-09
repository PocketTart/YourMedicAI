// routes/upload.route.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Required to check/create directory

const router = express.Router(); // Create an Express Router

// --- Multer Storage Configuration ---
const UPLOAD_FOLDER = 'uploads/'; // Directory to save uploaded files (relative to where server starts)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Ensure the uploads directory exists
    if (!fs.existsSync(UPLOAD_FOLDER)) {
      fs.mkdirSync(UPLOAD_FOLDER, { recursive: true }); // `recursive: true` ensures parent directories are created
    }
    cb(null, UPLOAD_FOLDER);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent overwrites
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// --- Multer File Filter for PDF only ---
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true); // Accept the file
  } else {
    // Reject the file and provide an error message
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB file size limit (adjust as needed)
  }
});

// --- File Upload Route Definition ---
// This route will be accessible at '/api/user/upload_report' because of app.use('/api/user', uploadRoutes)
router.post('/upload_report', upload.array('files', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded or files are not PDFs.' });
  }

  const uploadedFilenames = req.files.map(file => file.filename);

  // --- IMPORTANT: Database Integration (Placeholder) ---
  // Here, you would typically save metadata about these uploaded PDFs
  // into your PostgreSQL database via Neon DB.
  // For example, you might store:
  // - user_id (from authentication, if you implement it)
  // - original_filename (file.originalname)
  // - stored_filename (file.filename)
  // - file_path (e.g., path.join(UPLOAD_FOLDER, file.filename))
  // - upload_date
  // - file_size (file.size)

  // Example:
  // req.files.forEach(file => {
  //   // You'd need to get user_id from authentication middleware before this point
  //   // savePdfMetadataToDb(req.user.id, file.originalname, file.filename, file.size, new Date());
  // });

  res.status(200).json({
    message: 'PDF files uploaded successfully!',
    filenames: uploadedFilenames
  });
});

module.exports = router; 