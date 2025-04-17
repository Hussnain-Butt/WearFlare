// models/Order.js
const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model
      required: true,
    },
    title: { type: String, required: true },
    price: { type: Number, required: true }, // Store price as number
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, required: false }, // Image path for reference
    selectedSize: { type: String, required: false }, // Store selected size
    selectedColor: { type: String, required: false }, // Store selected color
  },
  { _id: false },
) // Don't create separate IDs for subdocuments by default

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required.'],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required.'],
      trim: true,
      lowercase: true,
      // Basic email format validation (consider more robust validation)
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
      }, // Default country if applicable
    },
    orderItems: [orderItemSchema], // Array of items in the order
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'], // Possible order statuses
      default: 'Pending', // Default status when created
    },
    // Optional: Add fields like shipping cost, payment method (COD)
    paymentMethod: {
      type: String,
      required: true,
      default: 'Cash on Delivery',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  },
)

module.exports = mongoose.model('Order', orderSchema)
