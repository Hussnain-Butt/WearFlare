// Server/routes/adminRoutes.js
const express = require('express')
const {
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUser,
  // Import new dashboard-related controller functions
  getDashboardKeyMetrics,
  getRevenueTrend,
  getSalesByPlan,
  getRecentTransactions,
} = require('../controllers/adminController') // Assuming dashboard functions are in adminController

// Import the protect middleware using the correct path
const { protect } = require('../middlewares/authMiddleware') // Ensure this path is correct

const router = express.Router()

// ==============================================
// --- Public Route ---
// ==============================================

// POST /api/admin/login - Admin login endpoint
// This route does NOT require authentication.
router.post('/login', adminLogin)

// ================================================
// --- Protected User Management Routes (Admin Role Required) ---
// ================================================
// These routes require the user to be logged in AND have the 'admin' role.

// GET /api/admin/users - Fetch all users
router.get(
  '/users',
  protect(['admin']), // Apply protection: Only 'admin' role allowed
  getAllUsers,
)

// DELETE /api/admin/users/:id - Delete user by ID
router.delete('/users/:id', protect(['admin']), deleteUser)

// PUT /api/admin/users/:id - Update user by ID
router.put('/users/:id', protect(['admin']), updateUser)

// ================================================
// --- Protected Dashboard Data Routes (Admin Role Required) ---
// ================================================
// These routes provide data for the admin dashboard and require admin authentication.

// GET /api/admin/dashboard/key-metrics - Fetch key performance indicators
router.get('/dashboard/key-metrics', protect(['admin']), getDashboardKeyMetrics)

// GET /api/admin/dashboard/revenue-trend - Fetch data for revenue trend chart
router.get('/dashboard/revenue-trend', protect(['admin']), getRevenueTrend)

// GET /api/admin/dashboard/sales-by-plan - Fetch data for sales distribution chart
router.get('/dashboard/sales-by-plan', protect(['admin']), getSalesByPlan)

// GET /api/admin/dashboard/recent-transactions - Fetch recent orders/transactions
router.get('/dashboard/recent-transactions', protect(['admin']), getRecentTransactions)

// You can add other admin-only routes here following the same pattern.

module.exports = router // Export the configured router
