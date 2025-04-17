// models/managerModel.js
const mongoose = require('mongoose')

// Schema remains the same
const managerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Added unique constraint
  password: { type: String, required: true },
  // Optional: Add a role field if you might have different manager types later
  // role: { type: String, default: 'product_manager' }
})

// Exporting as 'Manager' is correct
module.exports = mongoose.model('Manager', managerSchema)
