// models/Product.js
const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    price: { type: String, required: true }, // Consider Number type for calculations
    category: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    gender: { type: String, required: true, enum: ['Men', 'Women', 'Unisex'] }, // Use enum for fixed values
    image: { type: String, required: true },
    // inStock: { type: Boolean, default: true }, // REMOVED - Replaced by stockDetails logic

    // Keep track of explicitly defined available sizes
    sizes: {
      type: [String],
      default: [],
      // Optional: Add validator to ensure sizes are reasonable (e.g., uppercase, non-empty)
      validate: {
        validator: function (arr) {
          return arr.every((s) => typeof s === 'string' && s.trim().length > 0)
        },
        message: 'Sizes must be non-empty strings.',
      },
    },

    // --- NEW: Detailed Stock per Size ---
    stockDetails: {
      type: Map, // Key = Size (String, e.g., "S", "M"), Value = Quantity (Number)
      of: Number, // Values in the map must be numbers
      default: {}, // Default to an empty map
      required: true, // Make sure stock details are provided
      validate: {
        validator: function (map) {
          if (map.size === 0 && this.sizes.length > 0) {
            // If sizes are defined, stockDetails cannot be empty unless sizes array is also empty
            // Allow empty stockDetails if sizes array is empty (product might not have size variants)
            return false
          }
          // Ensure all quantities are non-negative integers
          for (let [size, quantity] of map.entries()) {
            // Ensure size key is a non-empty string
            if (typeof size !== 'string' || size.trim() === '') return false
            // Ensure quantity is a non-negative integer
            if (!Number.isInteger(quantity) || quantity < 0) {
              return false
            }
          }
          return true
        },
        message: (props) =>
          `Invalid stockDetails. Ensure all sizes have a non-negative integer quantity and keys are valid strings. Stock cannot be empty if sizes are defined.`,
      },
    },
    // --- END NEW ---

    isNewCollection: {
      type: Boolean,
      default: false,
      index: true, // Keep index for faster querying
    },
  },
  {
    timestamps: true,
    // Ensure virtuals are included when converting to JSON or Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// --- VIRTUAL PROPERTY: isInStock ---
// Dynamically checks if *any* size has a stock quantity greater than 0
ProductSchema.virtual('isInStock').get(function () {
  // Check if stockDetails is defined and has entries
  if (this.stockDetails && this.stockDetails.size > 0) {
    // Iterate through the quantities in the map
    for (let quantity of this.stockDetails.values()) {
      if (quantity > 0) {
        return true // Found at least one size with stock > 0
      }
    }
  }
  // If no stock details or all quantities are 0, return false
  return false
})

// --- Pre-save Middleware (Optional but Recommended) ---
// Ensure stockDetails keys match the sizes array and standardize size casing (e.g., uppercase)
ProductSchema.pre('save', function (next) {
  if (this.isModified('sizes') || this.isModified('stockDetails')) {
    const standardizedSizes = this.sizes.map((s) => s.trim().toUpperCase()).filter((s) => s) // Trim, uppercase, remove empty
    const standardizedStock = new Map()
    const allowedSizesSet = new Set(standardizedSizes)

    // Standardize stockDetails keys and remove entries for sizes not in the sizes array
    for (let [size, quantity] of this.stockDetails.entries()) {
      const upperSize = size.trim().toUpperCase()
      if (upperSize && allowedSizesSet.has(upperSize)) {
        // Only keep stock for listed sizes
        standardizedStock.set(upperSize, quantity)
      }
    }

    // Optional: Ensure all listed sizes have an entry in stockDetails (defaulting to 0 if missing)
    // for (const size of standardizedSizes) {
    //   if (!standardizedStock.has(size)) {
    //     // Decide whether to add with 0 quantity or throw an error
    //     // standardizedStock.set(size, 0); // Add missing sizes with 0 stock
    //     // OR: return next(new Error(`Missing stock quantity for size: ${size}`));
    //   }
    // }

    this.sizes = standardizedSizes // Update sizes array
    this.stockDetails = standardizedStock // Update stockDetails map
  }
  next()
})

module.exports = mongoose.model('Product', ProductSchema)
