// routes/tryonRoutes.js
const express = require('express')
const multer = require('multer')
const tryonController = require('../controllers/tryonController')
const path = require('path') // Ensure path is required
const fs = require('fs') // Require fs for directory check/creation

console.log('--- Loading tryonRoutes.js ---')

const router = express.Router()

// --- Multer Configuration ---
const uploadDest = 'uploads/userImages/' // Relative path from project root
console.log(`--- Configuring Multer: Destination set to ${path.resolve(uploadDest)} ---`)

// Ensure the destination directory exists synchronously on startup
try {
  if (!fs.existsSync(uploadDest)) {
    console.log(`Creating Multer destination directory: ${uploadDest}`)
    fs.mkdirSync(uploadDest, { recursive: true })
  }
  console.log(`Multer destination directory OK: ${uploadDest}`)
} catch (err) {
  console.error(
    `❌ CRITICAL: Failed to ensure Multer upload directory '${uploadDest}'. File uploads will likely fail. Error:`,
    err,
  )
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination should exist now, just provide the path
    cb(null, uploadDest)
  },
  filename: function (req, file, cb) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
      console.log(
        `--- Multer generating filename: ${filename} for original: ${file.originalname} ---`,
      )
      cb(null, filename)
    } catch (err) {
      console.error('❌ Error in Multer filename generation:', err)
      cb(new Error('Failed to generate filename')) // Pass error to Multer
    }
  },
})

// Configure Multer middleware with size limit and file filter (optional)
const MAX_FILE_SIZE_MB = 5
const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 }, // Example: 5 MB limit
  fileFilter: function (req, file, cb) {
    // Optional: Accept only specific image types
    const allowedTypes = /jpeg|jpg|png|webp/
    const mimetype = allowedTypes.test(file.mimetype)
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (mimetype && extname) {
      return cb(null, true)
    }
    cb(new Error(`File upload rejected: Only ${allowedTypes} types are allowed.`))
  },
})

// --- Routes ---

// POST route to initiate the try-on job (with Multer error handling)
router.post(
  '/',
  (req, res, next) => {
    console.log('--- Received POST request on /api/tryon ---')
    const uploader = upload.single('userImage') // Middleware for single file upload

    uploader(req, res, function (err) {
      // Handle Multer-specific errors first
      if (err instanceof multer.MulterError) {
        console.error('❌ Multer Error:', err)
        let message = `File upload error: ${err.message}.`
        if (err.code === 'LIMIT_FILE_SIZE') {
          message = `File is too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`
        }
        return res.status(400).json({ error: message, code: err.code })
      } else if (err) {
        // Handle other errors during upload (like fileFilter rejection)
        console.error('❌ Upload Filter/Unknown Error:', err)
        return res.status(400).json({ error: err.message || 'File upload failed.' })
      }
      // If upload is successful (or no file was sent but field existed), proceed to controller
      console.log(
        '--- Multer processing complete (success or no file), proceeding to handleTryOn controller ---',
      )
      next() // Call the next middleware/handler (tryonController.handleTryOn)
    })
  },
  tryonController.handleTryOn,
)

// GET route to check the status of a try-on job
router.get(
  '/status/:jobId',
  (req, res, next) => {
    // Basic validation or sanitization of jobId could be added here
    console.log(`--- Received GET request on /api/tryon/status/${req.params.jobId} ---`)
    next() // Proceed to the controller
  },
  tryonController.checkTryOnStatus,
)

console.log('--- Tryon routes registered (/ and /status/:jobId) ---')

module.exports = router
