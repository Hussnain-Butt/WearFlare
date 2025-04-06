// routes/tryonRoutes.js
const express = require('express')
const multer = require('multer')
const tryonController = require('../controllers/tryonController')
const path = require('path') // Ensure path is required
const fs = require('fs') // Require fs if using directory creation

console.log('--- Loading tryonRoutes.js ---') // Log: File loaded

const router = express.Router()

// Configure Multer for image uploads
const uploadDest = 'uploads/userImages/'
console.log(`--- Configuring Multer: Destination set to ${path.resolve(uploadDest)} ---`) // Log: Multer config

// Ensure the destination directory exists
try {
  if (!fs.existsSync(uploadDest)) {
    console.log(`Creating Multer destination directory: ${uploadDest}`)
    fs.mkdirSync(uploadDest, { recursive: true })
  }
} catch (err) {
  console.error(
    `❌ CRITICAL: Failed to create Multer upload directory '${uploadDest}'. File uploads will fail. Error:`,
    err,
  )
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination should exist now, but callback is still needed
    cb(null, uploadDest)
  },
  filename: function (req, file, cb) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)
      console.log(`--- Multer generating filename: ${filename} for file: ${file.originalname} ---`) // Log: Filename generation
      cb(null, filename)
    } catch (err) {
      console.error('❌ Error in Multer filename generation:', err)
      cb(err) // Pass error to Multer
    }
  },
})

// File size limit (e.g., 5MB) - adjust as needed
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
})

// POST route to initiate the try-on job
// Added error handling for Multer specifically
router.post(
  '/',
  (req, res, next) => {
    console.log('--- Received POST request on /api/tryon ---') // Log: Request received
    const uploader = upload.single('userImage')

    uploader(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred (e.g., file too large)
        console.error('❌ Multer Error:', err)
        return res.status(400).json({ error: `File upload error: ${err.message}` })
      } else if (err) {
        // An unknown error occurred during upload
        console.error('❌ Unknown Upload Error:', err)
        return res.status(500).json({ error: 'An unknown error occurred during file upload.' })
      }
      // If no upload error, proceed to the controller
      console.log(
        '--- File upload successful (or no file), proceeding to handleTryOn controller ---',
      ) // Log: Proceeding
      next()
    })
  },
  tryonController.handleTryOn,
)

// GET route to check the status of a try-on job
router.get(
  '/status/:jobId',
  (req, res, next) => {
    console.log(`--- Received GET request on /api/tryon/status/${req.params.jobId} ---`) // Log: Status request
    next()
  },
  tryonController.checkTryOnStatus,
)

console.log('--- Tryon routes registered (/ and /status/:jobId) ---') // Log: Routes registered

module.exports = router
