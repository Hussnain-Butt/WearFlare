// middleware/uploadMiddleware.js
const multer = require('multer')
const path = require('path')
const fs = require('fs')

// Define storage location and filename strategy
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'uploads', 'photos') // Go up one level from middleware, then into uploads/photos
    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath) // Use the absolute path
  },
  filename: function (req, file, cb) {
    // Create a unique filename: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter (optional: accept only specific image types)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/webp'
  ) {
    cb(null, true) // Accept file
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, or WEBP allowed.'), false) // Reject file
  }
}

// Configure Multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit (adjust as needed)
  },
  fileFilter: fileFilter, // Apply the file filter
})

module.exports = upload
