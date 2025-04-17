// models/Product.js
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: false },
    gender: { type: String, required: true },
    image: { type: String, required: true },
    inStock: { type: Boolean, required: true, default: true },
    sizes: { type: [String], default: [] },
    // --- *** NEW FIELD for New Collection *** ---
    isNewCollection: {
      type: Boolean,
      default: false, // Default to NOT being in the new collection
      index: true, // Add an index for faster querying of new collection items
    },
    // --- *** END NEW FIELD *** ---
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Product', ProductSchema)
