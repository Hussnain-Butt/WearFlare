// models/Product.js
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String, // Consider changing to Number if appropriate for calculations
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false, // Making description optional
    },
    gender: {
      type: String,
      required: true, // e.g. "Men" or "Women"
    },
    image: {
      type: String,
      required: true, // Path to the uploaded image, e.g., /uploads/imagename.jpg
    },
    inStock: {
      type: Boolean,
      required: true,
      default: true, // Default to true (In Stock)
    },
    // --- ADDED SIZES FIELD ---
    sizes: {
      type: [String], // Defines an array of Strings
      default: [], // Default to an empty array if no sizes are provided
    },
    // --- END SIZES FIELD ---

    // --- OPTIONAL: Add other fields similarly if needed ---
    // colors: {
    //   type: [String], // Example: ['#FFFFFF', '#000000', 'Blue']
    //   default: [],
    // },
    // fit: {
    //   type: String, // Example: 'Regular Fit', 'Slim Fit'
    //   required: false,
    // },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  },
)

module.exports = mongoose.model('Product', ProductSchema)
