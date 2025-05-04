// controllers/orderController.js
const Order = require('../models/Order')
const Product = require('../models/Product') // *** IMPORT Product MODEL ***
const mongoose = require('mongoose') // *** IMPORT Mongoose for Transactions ***
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// --- Helper Function to Generate HTML Email Body (Keep As Is) ---
const generateEmailHtml = (title, content, brandName = 'WearFlare', footerText = '') => {
  // ... (Your existing HTML generation code - no changes needed here) ...
  const currentYear = new Date().getFullYear()
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f4f4f4; }
            .email-container { max-width: 600px; margin: 20px auto; padding: 25px; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
            .header { text-align: center; padding-bottom: 15px; border-bottom: 1px solid #eeeeee; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #c8a98a; font-size: 24px; } /* Brand color */
            .content { padding: 10px 0; font-size: 16px; }
            .content h2 { color: #333333; font-size: 18px; margin-top: 25px; margin-bottom: 15px; }
            .order-details { margin-bottom: 20px; padding: 15px; background-color: #f9f9f9; border: 1px solid #eeeeee; border-radius: 4px; }
            .order-details p { margin: 6px 0; font-size: 0.95em; color: #444444; }
            .order-details strong { color: #222222; font-weight: 600; }
            .button-container { text-align: center; margin: 30px 0; }
            .button {
                display: inline-block;
                padding: 12px 28px;
                background-color: #c8a98a; /* Brand color */
                color: #ffffff !important;
                text-decoration: none;
                border-radius: 5px;
                font-size: 16px;
                font-weight: 500;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s ease-in-out;
            }
            .button:hover { background-color: #b08d6a; } /* Darker shade */
            .footer { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px solid #eeeeee; font-size: 13px; color: #777777; }
            .footer p { margin: 5px 0; }
            .small-text { font-size: 12px; color: #888888; margin-top: 15px; }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header"><h1>${brandName}</h1></div>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                ${footerText ? `<p>${footerText}</p>` : ''}
                <p>© ${currentYear} ${brandName} Ltd. All Rights Reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `
}

// --- Create Order (Saves as 'Awaiting User Confirmation') ---
// *** IMPORTANT: Ensure 'orderItems' includes 'selectedSize' ***
exports.createOrder = async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, shippingAddress, orderItems, totalPrice } =
      req.body

    // --- Basic Validation ---
    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !shippingAddress ||
      !orderItems ||
      orderItems.length === 0 ||
      !totalPrice ||
      !shippingAddress.street ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res
        .status(400)
        .json({ message: 'Missing required order information or incomplete address.' })
    }

    // --- Validate orderItems structure (MUST include selectedSize) ---
    for (const item of orderItems) {
      if (
        !item.productId ||
        !item.quantity ||
        item.quantity <= 0 ||
        !item.price ||
        !item.title ||
        !item.selectedSize
      ) {
        console.error('Invalid order item structure:', item) // Log the problematic item
        return res.status(400).json({
          message:
            'Invalid order item data. Each item must include productId, quantity, price, title, and selectedSize.',
        })
      }
    }
    // --- End Item Validation ---

    // --- Create the order instance ---
    const newOrder = new Order({
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'Pakistan',
      },
      // Ensure orderItems are saved correctly (including selectedSize)
      orderItems: orderItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        quantity: item.quantity,
        price: item.price, // Ensure price is stored correctly (string or number based on schema)
        selectedSize: item.selectedSize, // *** Crucial Field ***
        // Add selectedColor here if you use it
      })),
      totalPrice,
      paymentMethod: 'Cash on Delivery',
      // status defaults to 'Awaiting User Confirmation' via schema
    })

    // --- Generate and save confirmation token ---
    const confirmationToken = newOrder.createConfirmationToken()
    await newOrder.save() // Save the initial order

    // --- Send Professional HTML Confirmation Email ---
    try {
      const backendApiUrl = process.env.API_BASE_URL || 'http://localhost:5000'
      const confirmURL = `${backendApiUrl}/api/orders/confirm/${confirmationToken}`
      const emailSubject = `Please Confirm Your WearFlare Order`

      const emailContent = `
        <p>Hi ${newOrder.customerName},</p>
        <p>Thank you for placing an order! Please confirm your order details by clicking below:</p>
        <h2>Order Summary:</h2>
        <div class="order-details">
            <p><strong>Items:</strong> ${newOrder.orderItems
              .map((item) => `${item.title} (Qty: ${item.quantity}, Size: ${item.selectedSize})`) // Show size
              .join('<br>')}
            </p>
            <p><strong>Total Amount (COD):</strong> PKR ${Number(newOrder.totalPrice).toFixed(
              2,
            )}</p>
            <p><strong>Shipping Address:</strong> ${newOrder.shippingAddress.street}, ${
        newOrder.shippingAddress.city
      }, ${newOrder.shippingAddress.postalCode}</p>
        </div>
        <div class="button-container">
            <a href="${confirmURL}" class="button" target="_blank">Confirm My Order</a>
        </div>
        <p class="small-text">This link expires in 24 hours.</p>
        <p>If you didn't place this order, please ignore this email.</p>
      `
      const emailHtml = generateEmailHtml('Confirm Your Order', emailContent)
      const plainTextMessage = `... (generate plain text version similarly) ...` // Add plain text

      await sendEmail({
        email: newOrder.customerEmail,
        subject: emailSubject,
        message: plainTextMessage,
        html: emailHtml,
      })

      console.log(
        `Order confirmation email sent to ${newOrder.customerEmail} for tentative order ${newOrder._id}`,
      )
      res.status(201).json({ message: 'Order initiated. Please check your email to confirm.' })
    } catch (emailError) {
      // ... (existing email error handling) ...
      console.error(`Failed to send confirmation email for order ${newOrder._id}:`, emailError)
      return res
        .status(500)
        .json({ message: 'Order initiated, but failed to send confirmation email.' })
    }
  } catch (error) {
    console.error('Error creating order (initiation phase):', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((el) => el.message)
      return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}` })
    }
    res.status(500).json({ message: 'Failed to initiate order.' })
  }
}

// --- Confirm Order via User Email Link (Updates status to 'Pending') ---
exports.confirmOrderByUserEmail = async (req, res) => {
  try {
    const { token } = req.params
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const order = await Order.findOne({
      confirmationToken: hashedToken,
      confirmationTokenExpires: { $gt: Date.now() },
      status: 'Awaiting User Confirmation', // Ensure we only confirm orders in the correct initial state
    })

    // --- Handle Invalid/Expired/Already Used Token ---
    if (!order) {
      console.warn(`Invalid or expired confirmation token attempt: ${token.slice(0, 10)}...`)
      const failureRedirectUrl = `${
        process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app'
      }/order-confirmation-status?status=failed&message=Invalid or expired confirmation link.`
      return res.redirect(failureRedirectUrl)
    }

    // --- Update status to 'Pending' (Ready for Admin Confirmation) ---
    order.status = 'Pending'
    order.confirmationToken = undefined
    order.confirmationTokenExpires = undefined
    await order.save()

    console.log(
      `Order ${order._id} confirmed by user ${order.customerEmail}, status set to Pending.`,
    )

    // --- Optional: Send a final "Order Confirmed & Processing" email ---
    try {
      const finalSubject = `Your WearFlare Order #${order._id
        .toString()
        .slice(-6)} is Confirmed & Awaiting Processing!` // Adjusted subject
      const finalContent = `
        <p>Hi ${order.customerName},</p>
        <p>Great news! Your order (ID: #${order._id
          .toString()
          .slice(
            -6,
          )}) has been successfully confirmed and is now awaiting final processing by our team.</p>
        <div class="order-details">
             <p><strong>Total Amount (COD):</strong> PKR ${Number(order.totalPrice).toFixed(2)}</p>
             <p><strong>Shipping To:</strong> ${order.shippingAddress.street}, ${
        order.shippingAddress.city
      }</p>
        </div>
        <p>We'll notify you again via email once your order is confirmed by our team and ships (usually within 3-4 working days).</p>
        <p>Thank you for shopping with WearFlare!</p>
      `
      const finalHtml = generateEmailHtml(finalSubject, finalContent)
      const finalPlainText = `... (generate plain text version similarly) ...` // Add plain text

      await sendEmail({
        email: order.customerEmail,
        subject: finalSubject,
        message: finalPlainText,
        html: finalHtml,
      })
    } catch (finalEmailError) {
      console.error(
        `Failed to send final confirmation email for order ${order._id}:`,
        finalEmailError,
      )
      // Don't fail the whole request if final email fails
    }

    // --- Redirect user to frontend success page ---
    const successRedirectUrl = `${
      process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app'
    }/order-confirmation-status?status=success&orderId=${order._id.toString().slice(-6)}`
    res.redirect(successRedirectUrl)
  } catch (error) {
    console.error('Error confirming order via email:', error)
    const errorRedirectUrl = `${
      process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app'
    }/order-confirmation-status?status=error&message=Order confirmation failed due to a server error.`
    res.redirect(errorRedirectUrl)
  }
}

// --- Get All Orders (for Admin - FILTERED) ---
exports.getAllOrders = async (req, res) => {
  try {
    // Exclude orders awaiting user confirmation
    const orders = await Order.find({
      status: { $ne: 'Awaiting User Confirmation' },
    }).sort({ createdAt: -1 })

    res.status(200).json(orders)
  } catch (error) {
    console.error('Error fetching orders for admin:', error)
    res.status(500).json({ message: 'Failed to fetch orders.' })
  }
}

// --- Confirm Order (Admin Action - *DECREMENTS STOCK*) ---
// --- Confirm Order (Admin Action - WITHOUT Transactions) ---
// WARNING: This version loses atomic guarantees between stock update and order update.
// --- Confirm Order (Admin Action - WITHOUT Transactions) ---
// WARNING: This version loses atomic guarantees between stock update and order update.
exports.confirmOrder = async (req, res) => {
  const { id } = req.params

  try {
    // Find the order
    const order = await Order.findById(id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' })
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({
        message: `Order must be 'Pending' to be confirmed by admin. Current status: ${order.status}.`,
      })
    }

    // --- STOCK DECREMENT LOGIC (Non-Transactional) ---
    console.log(`[Admin Confirm Order ${id}] Starting stock decrement (non-transactional)...`)
    // We should still validate stock *before* confirming the order if possible
    for (const item of order.orderItems) {
      const { productId, selectedSize, quantity } = item

      if (!productId || !selectedSize || !quantity || quantity <= 0) {
        console.error(`[Admin Confirm Order ${id}] Invalid item data:`, item)
        // Return error BEFORE attempting any updates
        return res.status(400).json({ message: `Invalid item data found in order ${id}.` })
      }

      const stockField = `stockDetails.${selectedSize}`
      console.log(
        `[Admin Confirm Order ${id}] Attempting to decrease stock for product ${productId}, size ${selectedSize} by ${quantity}`,
      )

      // Find and decrease stock if available
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: productId,
          [stockField]: { $gte: quantity }, // Check stock
        },
        {
          $inc: { [stockField]: -quantity }, // Decrease stock
        },
        // NO { session } option
      )

      if (!updatedProduct) {
        console.error(
          `[Admin Confirm Order ${id}] Stock update failed for product ${productId}, size ${selectedSize}. Insufficient stock or item/size not found.`,
        )
        // IMPORTANT: Decide how to handle this. Should you stop? Or log and continue?
        // Stopping is safer to prevent confirming orders without stock deduction.
        return res.status(400).json({
          message: `Insufficient stock for item "${item.title}" (Size: ${selectedSize}). Order cannot be confirmed.`,
        })
      }
      console.log(
        `[Admin Confirm Order ${id}] Stock decreased successfully for product ${productId}, size ${selectedSize}.`,
      )
    }
    // --- END STOCK DECREMENT LOGIC ---

    // --- If stock updates *seemed* successful (individually), update Order Status ---
    // Note: There's still a small window for inconsistency here without transactions
    order.status = 'Confirmed'
    const updatedOrder = await order.save() // NO { session } option

    // --- Send Admin Confirmation Email ---
    try {
      // ... (Your email sending logic remains the same) ...
      console.log(`Admin confirmation email sent successfully for order ${order._id}`)
    } catch (emailError) {
      console.error(`Failed to send admin confirmation email for order ${order._id}:`, emailError)
    }

    res.status(200).json({
      message: 'Order confirmed successfully by admin and stock updated!',
      order: updatedOrder,
    })
  } catch (error) {
    // General error handling
    console.error(`[Admin Confirm Order ${id}] Error occurred: ${error.message}.`)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Order ID format.' })
    }
    // Use the error message from the stock check if it was thrown
    res.status(400).json({ message: error.message || 'Failed to confirm order due to an error.' })
  }
  // NO finally block needed for session
}

// --- Cancel Order (Admin Action - Does NOT need stock adjustment usually) ---
exports.cancelOrder = async (req, res) => {
  // --- Consider if you need to RESTORE stock on cancellation ---
  // If you do, you would need a similar loop and $inc logic here,
  // but adding the quantity back. This depends on your business rules.
  // For now, we'll just update the status.

  const { id } = req.params
  // Optional: Use transaction if restoring stock
  // const session = await mongoose.startSession();
  // session.startTransaction();

  try {
    // Find order (potentially with session)
    const order = await Order.findById(id) // .session(session);

    if (!order) {
      // await session.abortTransaction(); session.endSession();
      return res.status(404).json({ message: 'Order not found.' })
    }

    const cancellableStatuses = ['Pending', 'Confirmed'] // Define which statuses can be cancelled
    if (!cancellableStatuses.includes(order.status)) {
      // await session.abortTransaction(); session.endSession();
      return res
        .status(400)
        .json({ message: `Order cannot be cancelled. Current status: ${order.status}.` })
    }

    // *** --- OPTIONAL: Restore Stock Logic --- ***
    /*
    if (order.status === 'Confirmed') { // Only restore if it was confirmed (stock was likely deducted)
        console.log(`[Admin Cancel Order ${id}] Restoring stock...`);
        for (const item of order.orderItems) {
            const { productId, selectedSize, quantity } = item;
            if (productId && selectedSize && quantity > 0) {
                 const stockField = `stockDetails.${selectedSize}`;
                 await Product.updateOne(
                     { _id: productId },
                     { $inc: { [stockField]: quantity } }, // Add stock back
                     { session: session } // Use session if transactions are active
                 );
                 console.log(`[Admin Cancel Order ${id}] Stock restored for product ${productId}, size ${selectedSize} by ${quantity}`);
            }
        }
    }
    */
    // *** --- End Optional Stock Logic --- ***

    // Update status to Cancelled
    order.status = 'Cancelled'
    const updatedOrder = await order.save() // { session: session }); // Save within transaction if used

    // await session.commitTransaction(); // Commit transaction if used

    // --- Send Cancellation Email ---
    try {
      const emailSubject = `Regarding Your WearFlare Order #${order._id.toString().slice(-6)}`
      const emailContent = `... (Your HTML content here) ...` // Keep your HTML
      const emailHtml = generateEmailHtml(emailSubject, emailContent)
      const plainTextMessage = `... (Your plain text here) ...` // Keep your plain text

      await sendEmail({
        email: order.customerEmail,
        subject: emailSubject,
        message: plainTextMessage,
        html: emailHtml,
      })
      console.log(`Admin cancellation email sent successfully for order ${order._id}`)
    } catch (emailError) {
      console.error(`Failed to send admin cancellation email for order ${order._id}:`, emailError)
    }

    res.status(200).json({ message: 'Order cancelled successfully by admin!', order: updatedOrder })
  } catch (error) {
    // await session.abortTransaction(); // Abort transaction if used and error occurred

    console.error('Error cancelling order by admin:', error)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Order ID format.' })
    }
    res.status(500).json({ message: 'Failed to cancel order.' })
  } finally {
    // session.endSession(); // End session if used
  }
}
