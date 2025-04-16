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

// NEW SEARCH ROUTES – In order BEFORE dynamic routes like '/:id'
router.get('/search', productController.searchProducts)
router.post('/search-by-image', upload.single('image'), productController.searchProductsByImage)

// GET a single product by id (dynamic route)
router.get('/:id', productController.getProductById)

// CREATE a new product (expects an image file in the "image" field)
router.post('/', upload.single('image'), productController.createProduct)

// UPDATE a product by id
router.put('/:id', upload.single('image'), productController.updateProduct)

// DELETE a product by id
router.delete('/:id', productController.deleteProduct)

module.exports = router
