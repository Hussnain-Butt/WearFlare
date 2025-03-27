// controllers/adminController.js
const Admin = require('../models/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Admin login function
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })

    if (!admin) {
      return res.status(400).json({ message: 'Admin not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // JWT token generation
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' })

    return res.json({ token })
  } catch (error) {
    return res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { adminLogin }
