// routes/adminRoutes.js
const express = require('express')
const {
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUser,
} = require('../controllers/adminController')

const router = express.Router()

// Admin login
router.post('/login', adminLogin)

// Admin: Manage Users
router.get('/users', getAllUsers) // Fetch all users
router.delete('/users/:id', deleteUser) // Delete user by ID
router.put('/users/:id', updateUser) // Update user by ID

module.exports = router
