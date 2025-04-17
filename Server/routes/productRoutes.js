// routes/productRoutes.js
const express = require('express')
const router = express.Router()
const multer = require('multer') // Assuming you need multer for uploads
const path = require('path') // If needed for path joining
const productController = require('../controllers/productController') // Ensure path is correct
// Assuming you have middleware setup if needed (e.g., for auth)
// const { protect, restrictTo } = require('../middlewares/authMiddleware');

// --- Multer Setup (Keep if used for uploads) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure 'uploads/' directory exists in your project root or specify correct path
    cb(null, path.join(__dirname, '..', 'uploads')) // Example: Points to 'uploads' folder in parent directory
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`) // Replace spaces in filename
  },
})

// Optional: Add file filter for security
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
  limits: { fileSize: 1024 * 1024 * 5 }, // Optional: Limit file size (e.g., 5MB)
})
// --- End Multer Setup ---

// --- Define Specific Routes FIRST ---

// GET /api/products - Fetch all products (or filter by gender)
router.get('/', productController.getProducts)

// GET /api/products/search?query=... - Search products (by category)
router.get('/search', productController.searchProducts)

// GET /api/products/new-collection - Fetch products marked as new collection
router.get('/new-collection', productController.getNewCollectionProducts) // <<< MOVED UP

// POST /api/products/search-by-image - Search using an image
// Ensure 'image' matches the field name used in the frontend FormData
router.post('/search-by-image', upload.single('image'), productController.searchProductsByImage)

// POST /api/products - Create a new product
// Ensure 'image' matches the field name used in the frontend FormData
router.post('/', upload.single('image'), productController.createProduct)

// --- Define Parameterized Routes (:id) LAST ---

// GET /api/products/:id - Fetch a single product by ID
router.get('/:id', productController.getProductById) // <<< NOW AFTER specific GETs

// PUT /api/products/:id - Update a product by ID
// Ensure 'image' matches the field name used in the frontend FormData if updating image
router.put('/:id', upload.single('image'), productController.updateProduct)

// DELETE /api/products/:id - Delete a product by ID
router.delete('/:id', productController.deleteProduct)

module.exports = router
