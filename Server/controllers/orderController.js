// controllers/orderController.js
const Order = require('../models/Order')
const Product = require('../models/Product') // If needed for validation/details
const sendEmail = require('../utils/sendEmail') // Import the email utility

// --- Create a new Order (for customer checkout) ---
exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress, // Expecting { street, city, postalCode, country }
      orderItems, // Expecting array of { productId, title, price, quantity, image, selectedSize?, selectedColor? }
      totalPrice,
    } = req.body

    // Basic validation (add more robust validation as needed)
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !orderItems ||
      orderItems.length === 0 ||
      !totalPrice
    ) {
      return res.status(400).json({ message: 'Missing required order information.' })
    }
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      return res.status(400).json({ message: 'Incomplete shipping address.' })
    }

    // TODO: Optional - Server-side validation:
    // 1. Verify product IDs exist and prices match the database.
    // 2. Check product stock (if implementing stock management).

    const newOrder = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: {
        // Ensure all parts of address are included
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'Pakistan', // Use default if not provided
      },
      orderItems,
      totalPrice,
      status: 'Pending', // Initial status
      paymentMethod: 'Cash on Delivery', // Set payment method
    })

    const savedOrder = await newOrder.save()

    // Optional: Send an initial "Order Received" email here if desired

    res.status(201).json({ message: 'Order placed successfully!', order: savedOrder })
  } catch (error) {
    console.error('Error creating order:', error)
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      // Collect specific validation messages
      const messages = Object.values(error.errors).map((el) => el.message)
      return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}` })
    }
    res.status(500).json({ message: 'Failed to place order. Please try again later.' })
  }
}

// --- Get All Orders (for Admin) ---
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch orders, sort by newest first. Populate product details if needed.
    // Consider pagination for large numbers of orders.
    const orders = await Order.find().sort({ createdAt: -1 })
    // Example population (if you need product details within orders):
    // const orders = await Order.find().sort({ createdAt: -1 }).populate('orderItems.productId', 'title category');

    res.status(200).json(orders)
  } catch (error) {
    console.error('Error fetching orders:', error)
    res.status(500).json({ message: 'Failed to fetch orders.' })
  }
}

// --- Confirm an Order (for Admin) ---
exports.confirmOrder = async (req, res) => {
  try {
    const { id } = req.params // Get order ID from URL parameters

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    // Check if order is already confirmed or in a non-confirmable state
    if (order.status !== 'Pending') {
      return res
        .status(400)
        .json({ message: `Order is already ${order.status}. Cannot re-confirm.` })
    }

    // Update order status to 'Confirmed'
    order.status = 'Confirmed'
    const updatedOrder = await order.save()

    // --- Send Confirmation Email ---
    try {
      const emailSubject = `Your Order #${order._id.toString().slice(-6)} is Confirmed!` // Use part of ID
      const emailMessage = `
        Hi ${order.customerName},\n
        Great news! Your order with WearFlare has been confirmed.\n
        Order ID: ${order._id}\n
        Items: ${order.orderItems
          .map((item) => `${item.title} (Qty: ${item.quantity})`)
          .join(', ')}\n
        Total Amount (COD): PKR ${order.totalPrice.toFixed(2)}\n
        Shipping Address: ${order.shippingAddress.street}, ${order.shippingAddress.city}, ${
        order.shippingAddress.postalCode
      }\n\n
        Your order will be delivered within 3 to 4 working days. Please keep the exact amount ready for Cash on Delivery.\n\n
        Thank you for shopping with us!\n
        WearFlare Team
      `

      await sendEmail({
        email: order.customerEmail,
        subject: emailSubject,
        message: emailMessage,
      })
      console.log(
        `Confirmation email sent successfully to ${order.customerEmail} for order ${order._id}`,
      )
    } catch (emailError) {
      console.error(`Failed to send confirmation email for order ${order._id}:`, emailError)
      // Decide if failure to send email should prevent the API success response.
      // Often, you'd still confirm the order but log the email error.
      // Optionally return a partial success message:
      // return res.status(200).json({ message: 'Order confirmed, but failed to send confirmation email.', order: updatedOrder });
    }
    // --- End Send Email ---

    res.status(200).json({ message: 'Order confirmed successfully!', order: updatedOrder })
  } catch (error) {
    console.error('Error confirming order:', error)
    // Handle potential CastError if ID format is invalid
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Order ID format.' })
    }
    res.status(500).json({ message: 'Failed to confirm order.' })
  }
}
// --- *** NEW: Cancel an Order (for Admin) *** ---
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params // Get order ID from URL

    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    // Determine which statuses can be cancelled (e.g., Pending or Confirmed)
    const cancellableStatuses = ['Pending', 'Confirmed']
    if (!cancellableStatuses.includes(order.status)) {
      return res
        .status(400)
        .json({ message: `Order cannot be cancelled. Current status: ${order.status}.` })
    }

    // Update order status to 'Cancelled'
    order.status = 'Cancelled'
    const updatedOrder = await order.save()

    // --- Optional: Send Cancellation Email ---
    try {
      const emailSubject = `Regarding Your WearFlare Order #${order._id.toString().slice(-6)}`
      const emailMessage = `
          Hi ${order.customerName},\n
          We regret to inform you that your recent order with WearFlare (ID: ${
            order._id
          }) has been cancelled.\n
          Items: ${order.orderItems
            .map((item) => `${item.title} (Qty: ${item.quantity})`)
            .join(', ')}\n
          Total Amount: PKR ${order.totalPrice.toFixed(2)}\n\n
          If you did not request this cancellation or have any questions, please contact our customer support.\n\n
          We apologize for any inconvenience.\n
          WearFlare Team
        `

      // Check if email should be sent based on status before cancellation if needed
      // e.g. if (originalStatus was 'Confirmed') sendEmail(...)

      await sendEmail({
        email: order.customerEmail,
        subject: emailSubject,
        message: emailMessage,
      })
      console.log(
        `Cancellation email sent successfully to ${order.customerEmail} for order ${order._id}`,
      )
    } catch (emailError) {
      console.error(`Failed to send cancellation email for order ${order._id}:`, emailError)
      // Log the error but proceed with the API response
    }
    // --- End Send Email ---

    res.status(200).json({ message: 'Order cancelled successfully!', order: updatedOrder })
  } catch (error) {
    console.error('Error cancelling order:', error)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid Order ID format.' })
    }
    res.status(500).json({ message: 'Failed to cancel order.' })
  }
}

// Optional: Add controllers for getting a single order, updating status further (Shipped, Delivered), etc.
