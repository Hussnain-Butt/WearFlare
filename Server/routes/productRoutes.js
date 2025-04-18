// routes/productRoutes.js
const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const productController = require('../controllers/productController') // Ensure path is correct
const { protect } = require('../middlewares/authMiddleware') // Import the protect middleware

// --- Multer Setup (Handles image uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure 'uploads/' directory exists relative to the project root
    // Adjust the path if your 'uploads' folder is located differently
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
  },
})

// File filter for security (allow only specific image types)
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

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // Optional: 5MB file size limit
})
// --- End Multer Setup ---

// ==============================================
// --- Public Routes (No Authentication Required) ---
// ==============================================

// GET /api/products - Fetch all products (can include query filters like gender, newCollection, limit)
router.get('/', productController.getProducts)

// GET /api/products/search?query=... - Search products (e.g., by category)
router.get('/search', productController.searchProducts)

// GET /api/products/new-collection - Fetch products marked as new collection
router.get('/new-collection', productController.getNewCollectionProducts)

// POST /api/products/search-by-image - Search using an image (assuming public access)
// Note: 'image' must match the field name in your frontend form data
router.post('/search-by-image', upload.single('image'), productController.searchProductsByImage)

// GET /api/products/:id - Fetch a single product by ID (must be AFTER specific GET routes)
router.get('/:id', productController.getProductById)

// ====================================================================
// --- Protected Routes (Require 'admin' or 'productManager' role) ---
// ====================================================================

// POST /api/products - Create a new product
// Middleware order: Authorize -> Handle Upload -> Controller Logic
router.post(
  '/',
  protect(['admin', 'productManager']), // Apply role protection
  upload.single('image'), // Handle potential image upload
  productController.createProduct, // Proceed if authorized and upload handled
)

// PUT /api/products/:id - Update a product by ID
// Middleware order: Authorize -> Handle Upload -> Controller Logic
router.put(
  '/:id',
  protect(['admin', 'productManager']), // Apply role protection
  upload.single('image'), // Handle potential image upload
  productController.updateProduct, // Proceed if authorized and upload handled
)

// DELETE /api/products/:id - Delete a product by ID
// Middleware order: Authorize -> Controller Logic (no upload needed)
router.delete(
  '/:id',
  protect(['admin', 'productManager']), // Apply role protection
  productController.deleteProduct, // Proceed if authorized
)

module.exports = router
