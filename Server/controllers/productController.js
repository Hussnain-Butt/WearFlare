const Product = require('../models/Product')

exports.getProducts = async (req, res) => {
  try {
    // Optionally filter by gender if provided as a query parameter
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

exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, gender } = req.body
    // If an image was uploaded, store its path
    const image = req.file ? `/uploads/${req.file.filename}` : ''
    const product = new Product({ title, price, category, gender, image })
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const { title, price, category, gender } = req.body
    const updatedFields = { title, price, category, gender }

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

// ✅ DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id)
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' })

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ✅ GET a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
