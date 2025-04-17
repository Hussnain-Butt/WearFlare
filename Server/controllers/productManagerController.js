// controllers/adminController.js
const Admin = require('../models/managerModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Admin login function
const productmanagerLogin = async (req, res) => {
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

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

// Update user info
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true })
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = {
  productmanagerLogin,
  getAllUsers,
  deleteUser,
  updateUser,
}
