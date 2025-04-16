// controllers/productController.js

const path = require('path')
const Product = require('../models/Product')
const vision = require('@google-cloud/vision')

// Instantiate the Vision client with the JSON key file
const client = new vision.ImageAnnotatorClient({
  keyFilename: path.join(__dirname, '../config/wearflare.json'),
})

/**
 * GET /api/products
 * Optional gender filter (req.query.gender)
 */
exports.getProducts = async (req, res) => {
  try {
    const gender = req.query.gender
    let filter = {}

    if (gender) {
      filter.gender = gender
    }

    const products = await Product.find(filter)
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/products
 * Create a new product (expects an image file in the "image" field)
 */
exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, gender, description } = req.body
    // If an image was uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : ''

    const product = new Product({ title, price, category, gender, image, description })
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * PUT /api/products/:id
 * Update an existing product
 */
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, category, gender, description } = req.body
    const updatedFields = { title, price, category, gender, description }

    if (req.file) {
      updatedFields.image = `/uploads/${req.file.filename}`
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    })

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' })
    res.json(updatedProduct)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * DELETE /api/products/:id
 * Delete a product by ID
 */
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' })

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/products/:id
 * Get a single product by ID
 */
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * GET /api/products/search?query=someText
 * Text-based search in product title
 */
exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' })
    }

    // Regex for partial matching in "title"
    const products = await Product.find({
      title: { $regex: query, $options: 'i' },
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

/**
 * POST /api/products/search-by-image
 * Image-based search using Google Cloud Vision
 */
exports.searchProductsByImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' })
    }

    // Label detection using Cloud Vision
    const [result] = await client.labelDetection(req.file.path)
    const labels = result.labelAnnotations.map((label) => label.description)

    // Example: search products in DB for each detected label
    let products = []
    for (let label of labels) {
      const foundProducts = await Product.find({
        title: { $regex: label, $options: 'i' },
      })
      products = [...products, ...foundProducts]
    }

    // Remove duplicates using Set
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
