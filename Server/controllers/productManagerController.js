// controllers/productManagerController.js
const Manager = require('../models/managerModel') // Use Manager consistently
const Product = require('../models/Product') // Assuming you have a Product model
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// --- Manager Login ---
const productmanagerLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    // Find manager by username
    const manager = await Manager.findOne({ username }) // Use Manager model

    if (!manager) {
      // Use 401 for authentication failures
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, manager.password) // Use manager.password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate JWT token for the manager
    const token = jwt.sign(
      { id: manager._id, role: 'product_manager' }, // Include role if needed
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Or longer based on preference
    )

    return res.json({ token }) // Send only the token back
  } catch (error) {
    console.error('Manager login error:', error) // Log the error
    return res.status(500).json({ message: 'Server error during login' })
  }
}

// --- Manager: Manage Products ---

// GET all products (Example - adjust fields as needed)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }) // Fetch products
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Failed to fetch products' })
  }
}

// GET single product (if needed for editing prepopulation)
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    console.error('Error fetching product by ID:', error)
    res.status(500).json({ message: 'Failed to fetch product details' })
  }
}

// POST a new product (Handles FormData)
const addProduct = async (req, res) => {
  try {
    const { title, price, category, gender, description, inStock, sizes, isNewCollection } =
      req.body

    if (!req.file) {
      return res.status(400).json({ message: 'Product image is required' })
    }

    const imagePath = '/uploads/photos/' + req.file.filename // Path relative to server root '/uploads'

    const newProduct = new Product({
      title,
      price: Number(price), // Ensure price is stored as a number
      category,
      gender,
      description,
      image: imagePath, // Store the accessible path
      inStock: inStock === 'true', // Convert string boolean
      isNewCollection: isNewCollection === 'true', // Convert string boolean
      sizes: sizes
        ? sizes
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s)
        : [], // Handle sizes string
    })

    await newProduct.save()
    res.status(201).json(newProduct) // Return the created product
  } catch (error) {
    console.error('Error adding product:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors })
    }
    res.status(500).json({ message: 'Failed to add product' })
  }
}

// PUT update a product (Handles FormData and partial updates)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body } // Copy body data

    // Handle boolean conversions from FormData strings
    if (updateData.inStock !== undefined) {
      updateData.inStock = updateData.inStock === 'true'
    }
    if (updateData.isNewCollection !== undefined) {
      updateData.isNewCollection = updateData.isNewCollection === 'true'
    }
    if (updateData.price !== undefined) {
      updateData.price = Number(updateData.price) // Ensure price is number
    }
    if (updateData.sizes !== undefined) {
      updateData.sizes = updateData.sizes
        ? updateData.sizes
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s)
        : []
    }

    // If a new image file is uploaded, update the image path
    if (req.file) {
      updateData.image = '/uploads/photos/' + req.file.filename
      // Optional: Delete the old image file from storage here
    } else {
      // Ensure image field is not accidentally removed if not uploading new one
      delete updateData.image
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateData }, // Use $set for partial updates
      { new: true, runValidators: true }, // Return updated doc, run schema validators
    )

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(updatedProduct) // Return the updated product
  } catch (error) {
    console.error('Error updating product:', error)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors })
    }
    res.status(500).json({ message: 'Failed to update product' })
  }
}

// DELETE a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Optional: Delete the associated image file from storage here
    // const imagePath = path.join(__dirname, '..', 'uploads', 'photos', path.basename(deletedProduct.image));
    // fs.unlink(imagePath, (err) => { if (err) console.error("Error deleting image file:", err); });

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ message: 'Failed to delete product' })
  }
}

module.exports = {
  productmanagerLogin,
  getAllProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
  // Add other manager-specific functions if needed
}
