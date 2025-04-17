// routes/orderRoutes.js
const express = require('express')
const orderController = require('../controllers/orderController')
// const { protect, restrictTo } = require('../middlewares/authMiddleware'); // If using auth

const router = express.Router()

// POST /api/orders - Place a new order (Customer)
router.post('/', orderController.createOrder)

// GET /api/orders - Get all orders (Admin)
router.get(
  '/',
  // protect, restrictTo('admin'), // Add Auth if needed
  orderController.getAllOrders,
)

// PATCH /api/orders/:id/confirm - Confirm an order (Admin)
router.patch(
  '/:id/confirm',
  // protect, restrictTo('admin'), // Add Auth if needed
  orderController.confirmOrder,
)

// --- *** NEW: Cancel Order Route *** ---
// PATCH /api/orders/:id/cancel - Cancel an order (Admin)
router.patch(
  '/:id/cancel',
  // protect, restrictTo('admin'), // Add Auth if needed
  orderController.cancelOrder,
)
// --- *** END NEW *** ---

module.exports = router
