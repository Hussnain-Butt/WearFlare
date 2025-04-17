// routes/adminRoutes.js
const express = require('express')
const {
  productmanagerLogin,
  getAllUsers,
  deleteUser,
  updateUser,
} = require('../controllers/productManagerController')

const router = express.Router()

// Admin login
router.post('/login', productmanagerLogin)

// Admin: Manage Users
router.get('/users', getAllUsers) // Fetch all users
router.delete('/users/:id', deleteUser) // Delete user by ID
router.put('/users/:id', updateUser) // Update user by ID

module.exports = router
