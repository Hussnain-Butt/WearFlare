// controllers/productController.js

const path = require('path')
const Product = require('../models/Product')
// Comment out or setup Vision client as needed
// const vision = require('@google-cloud/vision');
// const client = new vision.ImageAnnotatorClient({ keyFilename: path.join(__dirname, '../config/your_keyfile.json') });

// --- Helper function to parse comma-separated sizes string ---
const parseSizesString = (sizesString) => {
  if (!sizesString || typeof sizesString !== 'string') return []
  return sizesString
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((s) => s)
}

// --- GET /api/products ---
exports.getProducts = async (req, res) => {
  try {
    const filter = req.query.gender
      ? { gender: { $regex: new RegExp(`^${req.query.gender}$`, 'i') } }
      : {}
    const products = await Product.find(filter).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: `Failed to fetch products: ${error.message}` })
  }
}

// --- POST /api/products ---
exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, gender, description, inStock, sizes } = req.body
    if (!title || !price || !category || !gender) {
      return res
        .status(400)
        .json({ message: 'Missing required fields: title, price, category, gender.' })
    }
    const imagePath = req.file ? `/uploads/${req.file.filename}` : ''
    const sizesArray = parseSizesString(sizes)
    const stockStatus = inStock !== undefined ? String(inStock).toLowerCase() === 'true' : true
    const product = new Product({
      title,
      price,
      category,
      gender,
      image: imagePath,
      description,
      inStock: stockStatus,
      sizes: sizesArray,
    })
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    if (error.name === 'ValidationError')
      return res.status(400).json({ message: `Validation Error: ${error.message}` })
    res.status(500).json({ message: `Failed to create product: ${error.message}` })
  }
}

// --- PUT /api/products/:id ---
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const { title, price, category, gender, description, inStock, sizes } = req.body
    const updatedFields = {}
    if (title !== undefined) updatedFields.title = title
    if (price !== undefined) updatedFields.price = price
    if (category !== undefined) updatedFields.category = category
    if (gender !== undefined) updatedFields.gender = gender
    if (description !== undefined) updatedFields.description = description
    if (inStock !== undefined) updatedFields.inStock = String(inStock).toLowerCase() === 'true'
    if (sizes !== undefined) updatedFields.sizes = parseSizesString(sizes)
    if (req.file) updatedFields.image = `/uploads/${req.file.filename}`
    if (Object.keys(updatedFields).length === 0 && !req.file)
      return res.status(400).json({ message: 'No update fields provided.' })
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updatedFields },
      { new: true, runValidators: true },
    )
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' })
    res.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    if (error.name === 'ValidationError')
      return res.status(400).json({ message: `Validation Error: ${error.message}` })
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    res.status(500).json({ message: `Failed to update product: ${error.message}` })
  }
}

// --- DELETE /api/products/:id ---
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' })
    // Optional: Add logic here to delete the associated image file from server storage
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    res.status(500).json({ message: `Failed to delete product: ${error.message}` })
  }
}

// --- GET /api/products/:id ---
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params
    const product = await Product.findById(id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    if (error.name === 'CastError')
      return res.status(400).json({ message: 'Invalid Product ID format.' })
    res.status(500).json({ message: `Failed to fetch product: ${error.message}` })
  }
}

// --- UPDATED: Text Search by Category ---
// Route: GET /api/products/search?query=...
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query // Get the search term from query parameters
    console.log(`[Search] Received category search query: "${query}"`) // Log received query

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res
        .status(400)
        .json({ message: 'Search query parameter is required and cannot be empty.' })
    }

    const trimmedQuery = query.trim()

    // Use a case-insensitive regex ($options: 'i') to find products
    // where the 'category' field matches the query.
    // The regex implicitly handles partial matches (e.g., "Shirt" would match "Shirts")
    // If you need exact match only (case-insensitive), use: /^${trimmedQuery}$/i
    const products = await Product.find({
      category: { $regex: trimmedQuery, $options: 'i' },
    })

    console.log(`[Search] Found ${products.length} products for category query "${trimmedQuery}"`) // Log results count

    res.json(products) // Send the array of found products (or empty array if none)
  } catch (error) {
    console.error('Error searching products by category:', error)
    res.status(500).json({ message: `Failed to search products: ${error.message}` })
  }
}
// --- END UPDATE ---

// --- Search by Image ---
// Route: POST /api/products/search-by-image
exports.searchProductsByImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image uploaded' })
    console.log('[Search] Received image for search:', req.file.originalname)

    // Placeholder for image analysis (e.g., Google Vision)
    // Replace this with your actual image analysis logic
    // const [result] = await client.labelDetection(req.file.path);
    // const labels = result.labelAnnotations.map((label) => label.description);
    const labels = ['ExampleLabel1', 'ExampleLabel2'] // Replace with actual labels
    console.log('[Search] Detected Labels (Placeholder):', labels)

    let products = []
    // Search using labels (currently searches title - adjust if needed)
    for (let label of labels) {
      const foundProducts = await Product.find({
        title: { $regex: label, $options: 'i' },
      })
      products.push(...foundProducts) // Add found products to the list
    }

    // Remove duplicates based on _id
    const uniqueIds = new Set()
    const uniqueProducts = products.filter((product) => {
      const idString = product._id.toString()
      if (!uniqueIds.has(idString)) {
        uniqueIds.add(idString)
        return true
      }
      return false
    })

    console.log(`[Search] Found ${uniqueProducts.length} unique products based on image labels.`)

    res.json({
      labels, // Send back the detected labels
      products: uniqueProducts, // Send back the unique products found
    })
  } catch (error) {
    console.error('Image Search Error:', error)
    res.status(500).json({ message: `Failed to search by image: ${error.message}` })
  }
}

exports.getNewCollectionProducts = async (req, res) => {
  try {
    // --- FIX HERE: Remove 'as string' ---
    // parseInt will try to convert the value; handle potential NaN
    const requestedLimit = parseInt(req.query.limit, 10) // Always provide radix 10
    const limit = !isNaN(requestedLimit) && requestedLimit > 0 ? requestedLimit : 3 // Use requested limit if valid, else default to 3
    // --- END FIX ---

    console.log(`[New Collection] Fetching up to ${limit} products.`)

    const newCollection = await Product.find({ isNewCollection: true })
      .sort({ createdAt: -1 }) // Show newest first
      .limit(limit)

    console.log(`[New Collection] Found ${newCollection.length} products marked as new.`)
    res.status(200).json(newCollection)
  } catch (error) {
    console.error('Error fetching new collection products:', error)
    res.status(500).json({ message: 'Failed to fetch new collection products.' })
  }
}
