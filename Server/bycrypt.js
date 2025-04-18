const bcrypt = require('bcryptjs')

// Generate a salt
const saltRounds = 10

bcrypt.hash('manager123', saltRounds, function (err, hash) {
  if (err) throw err
  console.log('Encrypted Password:', hash)
})
