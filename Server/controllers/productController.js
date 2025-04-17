// controllers/productController.js

const path = require('path')
const Product = require('../models/Product')
// Comment out Vision client if not used, or ensure it's configured correctly
// const vision = require('@google-cloud/vision');
// const client = new vision.ImageAnnotatorClient({
//   keyFilename: path.join(__dirname, '../config/your_google_keyfile.json'), // Ensure path is correct
// });

// --- Helper function to parse comma-separated sizes string ---
const parseSizesString = (sizesString) => {
  if (!sizesString || typeof sizesString !== 'string') {
    return [] // Return empty array if input is invalid or missing
  }
  return sizesString
    .split(',') // Split the string by commas
    .map((s) => s.trim().toUpperCase()) // Trim whitespace and convert to uppercase (optional, for consistency)
    .filter((s) => s) // Remove any empty strings (e.g., from trailing commas like "S, M, , L")
}
// --- End Helper Function ---

/**
 * GET /api/products
 * Retrieves all products or filters by gender. Includes all fields like inStock and sizes.
 */
exports.getProducts = async (req, res) => {
  try {
    const gender = req.query.gender
    let filter = {}

    if (gender) {
      // Case-insensitive gender matching might be useful depending on frontend input
      filter.gender = { $regex: new RegExp(`^${gender}$`, 'i') }
    }

    // find() returns all fields by default, including sizes and inStock
    const products = await Product.find(filter).sort({ createdAt: -1 }) // Sort by newest first
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: `Failed to fetch products: ${error.message}` })
  }
}

/**
 * POST /api/products
 * Creates a new product, handling image upload and parsing sizes.
 */
exports.createProduct = async (req, res) => {
  try {
    // Destructure all expected fields from the request body
    const { title, price, category, gender, description, inStock, sizes } = req.body

    // Check for required fields (adjust based on your schema's requirements)
    if (!title || !price || !category || !gender) {
      return res
        .status(400)
        .json({ message: 'Missing required fields: title, price, category, gender.' })
    }

    // Handle image upload (assuming multer middleware added filename to req.file)
    const imagePath = req.file ? `/uploads/${req.file.filename}` : ''
    // Optional: Add validation if image is strictly required for new products
    // if (!imagePath) {
    //    return res.status(400).json({ message: 'Product image is required.' });
    // }

    // Parse the comma-separated sizes string into an array
    const sizesArray = parseSizesString(sizes)

    // Determine inStock status (handle potential string 'true'/'false')
    const stockStatus = inStock !== undefined ? String(inStock).toLowerCase() === 'true' : true // Default to true

    // Create a new Product instance
    const product = new Product({
      title,
      price, // Consider validating/converting price to Number here or in model pre-save hook
      category,
      gender,
      image: imagePath,
      description,
      inStock: stockStatus,
      sizes: sizesArray, // Assign the parsed sizes array
      // Add other fields like colors, fit if they exist in req.body and model
    })

    // Save the new product to the database
    await product.save()
    res.status(201).json(product) // Respond with the created product data
  } catch (error) {
    console.error('Error creating product:', error)
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation Error: ${error.message}` })
    }
    res.status(500).json({ message: `Failed to create product: ${error.message}` })
  }
}

/**
 * PUT /api/products/:id
 * Updates an existing product. Handles partial updates and image replacement. Parses sizes.
 */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params // Get product ID from URL parameters
    // Destructure all potential update fields from the request body
    const { title, price, category, gender, description, inStock, sizes } = req.body

    // Build an object with only the fields that are present in the request
    const updatedFields = {}

    if (title !== undefined) updatedFields.title = title
    if (price !== undefined) updatedFields.price = price // Add validation/conversion if needed
    if (category !== undefined) updatedFields.category = category
    if (gender !== undefined) updatedFields.gender = gender
    if (description !== undefined) updatedFields.description = description
    // Handle boolean inStock field (convert string 'true'/'false' if necessary)
    if (inStock !== undefined) {
      updatedFields.inStock = String(inStock).toLowerCase() === 'true'
    }
    // --- Handle sizes update ---
    if (sizes !== undefined) {
      updatedFields.sizes = parseSizesString(sizes) // Parse and update the sizes array
    }
    // --- End sizes update ---

    // Handle image replacement if a new file is uploaded
    if (req.file) {
      // Optional: Delete the old image file from the server here if needed
      updatedFields.image = `/uploads/${req.file.filename}`
    }

    // Check if there are any fields to update
    if (Object.keys(updatedFields).length === 0 && !req.file) {
      return res.status(400).json({ message: 'No update fields provided.' })
    }

    // Find the product by ID and update it with the specified fields
    // { new: true } returns the updated document
    // { runValidators: true } ensures schema validation rules are applied during update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedFields }, // Use $set for partial updates
      { new: true, runValidators: true },
    )

    // If product with the given ID wasn't found
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(updatedProduct) // Respond with the updated product data
  } catch (error) {
    console.error('Error updating product:', error)
    // Handle potential validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: `Validation Error: ${error.message}` })
    }
    // Handle potential CastError if ID format is invalid
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    }
    res.status(500).json({ message: `Failed to update product: ${error.message}` })
  }
}

/**
 * DELETE /api/products/:id
 * Deletes a product by its ID.
 */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    // If no product was found with that ID
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Optional: Delete the associated image file from the /uploads folder here

    res.json({ message: 'Product deleted successfully' }) // Confirmation message
  } catch (error) {
    console.error('Error deleting product:', error)
    // Handle potential CastError if ID format is invalid
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    }
    res.status(500).json({ message: `Failed to delete product: ${error.message}` })
  }
}

/**
 * GET /api/products/:id
 * Retrieves a single product by its ID. Includes all fields.
 */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params
    // findById automatically includes all fields (title, price, ..., inStock, sizes)
    const product = await Product.findById(id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product) // Respond with the found product data
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    // Handle potential CastError if ID format is invalid
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    }
    res.status(500).json({ message: `Failed to fetch product: ${error.message}` })
  }
}

// --- Other controller methods (if any) ---

// Example: Text Search (modify if needed)
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' })
    }
    // Simple regex search on title (case-insensitive)
    const products = await Product.find({
      title: { $regex: query, $options: 'i' },
      // Add other fields to search if needed, e.g., description, category
    })
    res.json(products)
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({ message: `Failed to search products: ${error.message}` })
  }
}

// Example: Image Search (if using Google Vision)
// exports.searchProductsByImage = async (req, res) => { ... };

exports.searchProductsByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' })
    }
    const [result] = await client.labelDetection(req.file.path)
    const labels = result.labelAnnotations.map((label) => label.description)
    let products = []
    for (let label of labels) {
      const foundProducts = await Product.find({
        title: { $regex: label, $options: 'i' },
      })
      products = [...products, ...foundProducts]
    }
    const uniqueIds = new Set(products.map((p) => p._id.toString()))
    const uniqueProducts = Array.from(uniqueIds).map((id) =>
      products.find((p) => p._id.toString() === id),
    )
    res.json({
      labels,
      products: uniqueProducts,
    })
  } catch (error) {
    console.error('Vision Error:', error)
    res.status(500).json({ message: error.message })
  }
}
