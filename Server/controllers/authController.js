// controllers/authController.js
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail') // Ensure path is correct
const dotenv = require('dotenv')

dotenv.config() // Load .env variables

// --- Helper: Generate JWT Token ---
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '90d'
  if (!secret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.')
    // Throwing error is better for unrecoverable config issues
    throw new Error('Server configuration error: JWT secret missing.')
  }
  return jwt.sign({ id }, secret, { expiresIn })
}

// --- REGISTER USER ---
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password.' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' })
    }
    // Password length validated by schema now
    const user = await User.create({ fullName, email, password })
    const token = generateToken(user._id)

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: token,
    })
  } catch (error) {
    console.error('Register Error:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join(' ') })
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }
    res.status(500).json({ message: 'Server error during registration.' })
  }
}

// --- LOGIN USER ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' })
    }

    const user = await User.findOne({ email }).select('+password') // Need password to compare
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' }) // Use 401 for auth failure
    }

    const token = generateToken(user._id)
    res.json({
      // Status 200 is implicit
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: token,
    })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Server error during login.' })
  }
}

// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address.' })
  }

  try {
    const user = await User.findOne({ email })
    // Always return success-like message for security, even if user not found
    if (!user) {
      console.log(`Forgot password attempt - Email not found: ${email}`)
      return res
        .status(200)
        .json({
          message: 'If an account with that email exists, a password reset link has been sent.',
        })
    }

    // Generate tokens
    const rawResetToken = crypto.randomBytes(32).toString('hex')
    const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex')
    user.resetPasswordToken = hashedResetToken
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save({ validateBeforeSave: false })
    console.log(`Reset token generated for: ${user.email}`)

    // Construct URL
    const frontendBaseUrl =
      process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app' // Use deployed URL or local fallback
    const resetURL = `${frontendBaseUrl}/reset-password/${rawResetToken}` // RAW token in URL
    const currentYear = new Date().getFullYear()

    // Prepare email content (ensure these templates are correct)
    const htmlContent = `<!DOCTYPE html>... [Your full HTML template using ${resetURL}] ...</html>`
    const plainTextMessage = `Hello ${
      user.fullName || 'there'
    }, ... [Your full plain text template using ${resetURL}] ...`

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Wearflare Password Reset Request (Valid for 10 min)',
        message: plainTextMessage,
        html: htmlContent,
      })
      console.log(`Password reset email sent to: ${user.email}`)
      res.status(200).json({ message: 'Password reset link sent successfully.' }) // Consistent success message
    } catch (emailError) {
      // Important: Clear tokens if email fails, so user can try again
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save({ validateBeforeSave: false })
      console.error(`EMAIL SENDING ERROR for ${user.email}:`, emailError)
      return res
        .status(500)
        .json({ message: 'Error sending password reset email. Please try again later.' })
    }
  } catch (error) {
    console.error('FORGOT PASSWORD CONTROLLER ERROR:', error)
    res.status(500).json({ message: 'An internal error occurred. Please try again later.' })
  }
}

// --- RESET PASSWORD ---
const resetPassword = async (req, res) => {
  try {
    // 1) Get RAW token from URL param
    const rawToken = req.params.token
    if (!rawToken) return res.status(400).json({ message: 'Reset token not provided.' })

    // 2) Hash it
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    // 3) Find user by HASHED token & check expiry
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })

    // 4) If token invalid/expired or user not found
    if (!user) {
      console.log(`Reset password attempt with invalid/expired token hash: ${hashedToken}`)
      return res.status(400).json({ message: 'Token is invalid or has expired.' })
    }

    // 5) Validate new password from request body
    const { password, passwordConfirm } = req.body
    if (!password || !passwordConfirm) {
      return res.status(400).json({ message: 'Please provide new password and confirmation.' })
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'New passwords do not match.' })
    }
    // Schema handles min length

    // 6) Update password & clear reset fields (pre-save hook hashes)
    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save() // Trigger validation & hashing
    console.log(`Password successfully reset for user: ${user.email}`)

    // 7) Optional: Log user in
    const loginToken = generateToken(user._id)
    res.status(200).json({
      message: 'Password reset successful!',
      token: loginToken,
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    })
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join(' ') })
    }
    res.status(500).json({ message: 'An error occurred while resetting the password.' })
  }
}

module.exports = { registerUser, loginUser, forgotPassword, resetPassword }
