// createAdminHash.js
const bcrypt = require('bcryptjs')
const plainPassword = 'admin123' // The password you want to use
const saltRounds = 10 // Standard salt rounds

bcrypt.hash(plainPassword, saltRounds, function (err, hash) {
  if (err) {
    console.error('Error hashing password:', err)
    return
  }
  console.log('Password:', plainPassword)
  console.log('BCrypt Hash:', hash)
  // Copy this hash!
})
