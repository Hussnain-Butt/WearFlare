// routes/productManagerRoutes.js
const express = require('express')
const {
  productmanagerLogin,
  getAllProducts,
  getProductById, // If needed
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productManagerController') // Correct controller import
const upload = require('../middleware/uploadMiddleware') // Import multer middleware
// Optional: Add authentication middleware
// const { protectManager } = require('../middleware/authMiddleware');

const router = express.Router()

// --- Authentication ---
router.post('/login', productmanagerLogin) // Manager login endpoint

// --- Product Management (Example: Add middleware for authentication) ---
// Apply authentication middleware to all product routes below if needed
// router.use(protectManager);

// GET all products
router.get('/products', getAllProducts)

// GET single product (if needed)
router.get('/products/:id', getProductById)

// POST add new product (using multer for image upload)
// 'image' should match the name attribute of your file input in the form
router.post('/products', upload.single('image'), addProduct)

// PUT update product (using multer for optional image update)
router.put('/products/:id', upload.single('image'), updateProduct)

// DELETE product
router.delete('/products/:id', deleteProduct)

module.exports = router
