const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Create unique filenames
  }
});

const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/; // Allowed file types
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = fileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png)'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: fileFilter
});

// Route for uploading profile picture
router.post('/profile-picture', (req, res, next) => {
  upload.single('profilePicture')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Multer-specific errors
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Other errors
      return res.status(400).json({ error: err.message });
    }

    // Proceed to controller only if file upload is successful
    projectController.uploadProfilePicture(req, res);
  });
});

module.exports = router;
