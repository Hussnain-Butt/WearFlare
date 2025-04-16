const express = require('express')
const {
  registerUser,
  loginUser,
  forgotPassword, // Import
  resetPassword, // Import
} = require('../controllers/authController')

const router = express.Router()

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword) // Add route
router.patch('/reset-password/:token', resetPassword) // Add route (PATCH is suitable for updates)

module.exports = router
