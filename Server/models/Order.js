// models/Order.js
const mongoose = require('mongoose')
const crypto = require('crypto') // Import crypto for token generation

const orderItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: false },
    selectedSize: { type: String, required: false },
    selectedColor: { type: String, required: false },
  },
  { _id: false },
)

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: [true, 'Customer name is required.'], trim: true },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required.'],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    },
    customerPhone: {
      type: String,
      required: [true, 'Customer phone number is required.'],
      trim: true,
    },
    shippingAddress: {
      street: { type: String, required: [true, 'Street address is required.'], trim: true },
      city: { type: String, required: [true, 'City is required.'], trim: true },
      postalCode: { type: String, required: [true, 'Postal code is required.'], trim: true },
      country: {
        type: String,
        required: [true, 'Country is required.'],
        trim: true,
        default: 'Pakistan',
      },
    },
    orderItems: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      // Add 'Awaiting User Confirmation' and make it the default
      enum: [
        'Awaiting User Confirmation',
        'Pending',
        'Confirmed',
        'Shipped',
        'Delivered',
        'Cancelled',
      ],
      default: 'Awaiting User Confirmation', // <<< New Default
    },
    paymentMethod: { type: String, required: true, default: 'Cash on Delivery' },
    // --- New fields for email confirmation ---
    confirmationToken: String,
    confirmationTokenExpires: Date,
    // --- End new fields ---
  },
  {
    timestamps: true,
  },
)

// --- Method to generate confirmation token ---
orderSchema.methods.createConfirmationToken = function () {
  // Create a random token
  const confirmationToken = crypto.randomBytes(32).toString('hex')

  // Hash the token before saving to DB for security (optional but recommended)
  // We will store the hashed version and compare later
  this.confirmationToken = crypto.createHash('sha256').update(confirmationToken).digest('hex')

  // Set expiry time (e.g., 24 hours from now)
  this.confirmationTokenExpires = Date.now() + 24 * 60 * 60 * 1000 // 24 hours

  // Return the *unhashed* token to be sent via email
  return confirmationToken
}
// --- End method ---

module.exports = mongoose.model('Order', orderSchema)
