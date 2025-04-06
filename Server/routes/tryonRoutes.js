// routes/tryonRoutes.js
const express = require('express')
const multer = require('multer')
const tryonController = require('../controllers/tryonController')

const router = express.Router()

// Configure Multer for image uploads (Ensure destination exists)
// Adjust storage as needed (e.g., memory storage or custom filename logic)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/userImages/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Create a unique filename (e.g., timestamp + original name)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})
const upload = multer({ storage: storage })

// POST route to initiate the try-on job
router.post('/', upload.single('userImage'), tryonController.handleTryOn)

// GET route to check the status of a try-on job
router.get('/status/:jobId', tryonController.checkTryOnStatus) // <-- NAYA ROUTE YAHAN HAI

module.exports = router
