const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const productController = require('../controllers/productController')

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/') // Ensure the folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  },
})

const upload = multer({ storage })

// GET all products (with optional gender filter)
router.get('/', productController.getProducts)

// POST a new product (expects an image file in the "image" field)
router.post('/', upload.single('image'), productController.createProduct)
router.put('/:id', upload.single('image'), productController.updateProduct) // ✅ Update
router.delete('/:id', productController.deleteProduct) // ✅ Delete

module.exports = router
