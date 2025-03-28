const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true, // "men" or "women"
  },
  image: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Product', ProductSchema)
