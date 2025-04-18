// models/productManagerModel.js
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs') // Needed if you add pre-save hook

const productManagerSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Ensure username is unique
  password: { type: String, required: true },
  role: { type: String, default: 'productManager' }, // Add a role field
})

// Optional: Add a pre-save hook to hash password automatically if creating PMs via API later
// productManagerSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

module.exports = mongoose.model('ProductManager', productManagerSchema)
