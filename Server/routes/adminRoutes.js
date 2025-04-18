// Server/routes/adminRoutes.js
const express = require('express')
const {
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUser,
} = require('../controllers/adminController') // Import controller functions

// Import the protect middleware using the correct path
const { protect } = require('../middlewares/authMiddleware') // Use singular 'middleware'

const router = express.Router()

// ==============================================
// --- Public Route ---
// ==============================================

// POST /api/admin/login - Admin login endpoint
// This route does NOT require authentication.
router.post('/login', adminLogin)

// ================================================
// --- Protected Routes (Admin Role Required) ---
// ================================================
// These routes require the user to be logged in AND have the 'admin' role.
// The 'protect' middleware handles this verification.

// GET /api/admin/users - Fetch all users
router.get(
  '/users',
  protect(['admin']), // Apply protection: Only 'admin' role allowed
  getAllUsers, // Controller function to execute if authorized
)

// DELETE /api/admin/users/:id - Delete user by ID
router.delete(
  '/users/:id',
  protect(['admin']), // Apply protection: Only 'admin' role allowed
  deleteUser, // Controller function to execute if authorized
)

// PUT /api/admin/users/:id - Update user by ID
router.put(
  '/users/:id',
  protect(['admin']), // Apply protection: Only 'admin' role allowed
  updateUser, // Controller function to execute if authorized
)

// You can add other admin-only routes here following the same pattern.

module.exports = router // Export the configured router
