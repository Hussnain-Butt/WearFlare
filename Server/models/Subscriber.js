// models/Subscriber.js
const mongoose = require('mongoose')
const validator = require('validator') // Optional: for more robust email validation

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide your email address.'],
      unique: true, // Ensures no duplicate email subscriptions
      lowercase: true, // Convert email to lowercase before saving
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email address.'], // Use validator library
      // Basic regex validation as an alternative:
      // match: [/.+\@.+\..+/, 'Please provide a valid email address.'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
)

module.exports = mongoose.model('Subscriber', subscriberSchema)
