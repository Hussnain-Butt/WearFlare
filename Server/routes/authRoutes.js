// routes/authRoutes.js
const express = require('express')
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController') // Ensure path is correct

const router = express.Router()

router.post('/signup', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword) // Using PATCH

module.exports = router
