// routes/orderRoutes.js
const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const { protect } = require('../middlewares/authMiddleware') // Ensure this path is correct

// ==============================================
// --- Public Routes (No Authentication Required) ---
// ==============================================

// POST /api/orders - Customer places a new order (initiates confirmation email)
// This needs to be public.
router.post('/', orderController.createOrder)

// GET /api/orders/confirm/:token - User confirms their order via email link
// This also needs to be public as the user clicks it from their email client.
router.get('/confirm/:token', orderController.confirmOrderByUserEmail)

// =============================================================================
// --- Protected Routes (Require 'admin' or 'productManager' role via 'protect') ---
// =============================================================================
// These routes are for internal management after the user has confirmed their order.

// GET /api/orders - Admin/PM gets all orders (excluding 'Awaiting User Confirmation')
// Protect this route so only authorized roles can see the list of active orders.
router.get(
  '/',
  protect(['admin', 'productManager']), // Middleware checks for token and role
  orderController.getAllOrders, // Controller fetches filtered orders
)

// PATCH /api/orders/:id/confirm - Admin/PM confirms a 'Pending' order
// Protect this route. Admin/PM confirms orders after user confirmation.
router.patch(
  '/:id/confirm',
  protect(['admin', 'productManager']), // Middleware checks for token and role
  orderController.confirmOrder, // Controller updates status Pending -> Confirmed
)

// PATCH /api/orders/:id/cancel - Admin/PM cancels a 'Pending' or 'Confirmed' order
// Protect this route. Admin/PM can cancel orders.
router.patch(
  '/:id/cancel',
  protect(['admin', 'productManager']), // Middleware checks for token and role
  orderController.cancelOrder, // Controller updates status -> Cancelled
)

// -----------------------------------------------------------------------------
// Optional: Add other protected order management routes here if needed
// -----------------------------------------------------------------------------
// Example: Route to update status to 'Shipped' or 'Delivered'
/*
router.patch(
  '/:id/status',
  protect(['admin', 'productManager']), // Or maybe just 'admin' for shipping?
  orderController.updateOrderStatus // You would need to create this controller function
);

// Example: Route to get details of a single specific order
router.get(
    '/:id',
    protect(['admin', 'productManager']),
    orderController.getOrderById // You would need to create this controller function
);
*/
// -----------------------------------------------------------------------------

module.exports = router
