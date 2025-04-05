const express = require('express')
const multer = require('multer')
const { handleTryOn } = require('../controllers/tryonController')

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/userImages'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})

const upload = multer({ storage })

router.post('/', upload.single('userImage'), handleTryOn)

module.exports = router
