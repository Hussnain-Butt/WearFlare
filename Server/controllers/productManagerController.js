// controllers/productManagerController.js
const ProductManager = require('../models/productManagerModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const productManagerLogin = async (req, res) => {
  try {
    const { username, password } = req.body
    const pm = await ProductManager.findOne({ username })

    if (!pm) {
      return res.status(400).json({ message: 'Product Manager not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, pm.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // JWT token generation - INCLUDE ROLE
    const token = jwt.sign(
      { id: pm._id, role: pm.role }, // Include role here
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Or longer session time
    )

    // Optionally send back role or user info if needed by frontend
    return res.json({ token, role: pm.role })
  } catch (error) {
    console.error('Product Manager Login Error:', error)
    return res.status(500).json({ message: 'Server error during login' })
  }
}

module.exports = {
  productManagerLogin,
  // Add other PM-specific functions here if needed in the future
}
