// routes/orderRoutes.js
const express = require('express')
const orderController = require('../controllers/orderController')
const { protect } = require('../middlewares/authMiddleware') // Import the protect middleware

const router = express.Router()

// ==============================================
// --- Public Route (No Authentication Required) ---
// ==============================================

// POST /api/orders - Place a new order (Customer Checkout)
// This route should remain public for customers to place orders.
router.post('/', orderController.createOrder)

// ====================================================================
// --- Protected Routes (Require 'admin' or 'productManager' role) ---
// ====================================================================
// These routes are for managing orders, accessible by both admins and product managers.

// GET /api/orders - Get all orders
router.get(
  '/',
  protect(['admin', 'productManager']), // Protect: Admin or PM can view all orders
  orderController.getAllOrders,
)

// PATCH /api/orders/:id/confirm - Confirm an order
router.patch(
  '/:id/confirm',
  protect(['admin', 'productManager']), // Protect: Admin or PM can confirm orders
  orderController.confirmOrder,
)

// PATCH /api/orders/:id/cancel - Cancel an order
router.patch(
  '/:id/cancel',
  protect(['admin', 'productManager']), // Protect: Admin or PM can cancel orders
  orderController.cancelOrder,
)

// Optional: Add other order management routes here and protect them similarly
// Example: router.patch('/:id/status', protect(['admin', 'productManager']), orderController.updateOrderStatus);

module.exports = router
