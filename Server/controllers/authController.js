// controllers/authController.js
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail') // Ensure path is correct & sendEmail handles HTML
const dotenv = require('dotenv')

dotenv.config() // Load .env variables

// --- Helper: Generate JWT Token ---
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET
  const expiresIn = process.env.JWT_EXPIRES_IN || '90d'
  if (!secret) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.')
    throw new Error('Server configuration error: JWT secret missing.')
  }
  return jwt.sign({ id }, secret, { expiresIn })
}

// --- Helper: Generate Basic HTML Email ---
// (You can use the more advanced one from orderController if preferred)
const generateWelcomeEmailHtml = (userName, brandName = 'WearFlare') => {
  const currentYear = new Date().getFullYear()
  const frontendUrl = process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app' // Or your local URL
  return `
      <!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Welcome to ${brandName}</title><style>body{font-family:Arial,sans-serif;line-height:1.6;color:#333;margin:0;padding:0;background-color:#f4f4f4;}.container{max-width:600px;margin:20px auto;padding:20px;background-color:#ffffff;border:1px solid #ddd;border-radius:5px;}.header{text-align:center;padding-bottom:15px;border-bottom:1px solid #eee;}.header h1{margin:0;color:#c8a98a;}.content{padding:20px 0;}.button-container{text-align:center;margin:25px 0;}.button{display:inline-block;padding:12px 25px;background-color:#c8a98a;color:#ffffff !important;text-decoration:none;border-radius:5px;font-size:1em;}.footer{text-align:center;margin-top:20px;padding-top:15px;border-top:1px solid #eee;font-size:0.85em;color:#777;}</style></head><body><div class="container"><div class="header"><h1>${brandName}</h1></div><div class="content"><h2>Welcome Aboard, ${userName}!</h2><p>We're thrilled to have you at ${brandName}. Get ready to explore our latest collections.</p><div class="button-container"><a href="${frontendUrl}/shop" class="button" target="_blank">Start Shopping</a></div><p>If you have any questions, feel free to reach out to our support team.</p><p>Happy Shopping!</p></div><div class="footer"><p>© ${currentYear} ${brandName} Ltd. All Rights Reserved.</p></div></div></body></html>
    `
}

// --- REGISTER USER ---
const registerUser = async (req, res) => {
  // ... (registerUser code remains the same)
  try {
    const { fullName, email, password } = req.body
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide full name, email, and password.' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' })
    }
    const user = await User.create({ fullName, email, password })
    const token = generateToken(user._id)

    res
      .status(201)
      .json({ _id: user._id, fullName: user.fullName, email: user.email, token: token })
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

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    // --- User authenticated successfully ---

    // --- Generate JWT Token ---
    const token = generateToken(user._id)

    // --- Attempt to send Welcome Email (Non-blocking) ---
    try {
      console.log(`Attempting to send welcome email to ${user.email}`)
      const welcomeSubject = `Welcome to WearFlare, ${user.fullName}!`
      const welcomeHtml = generateWelcomeEmailHtml(user.fullName) // Generate HTML
      const welcomeText = `Welcome Aboard, ${
        user.fullName
      }!\n\nWe're thrilled to have you at WearFlare. Get ready to explore our latest collections.\n\nStart Shopping: ${
        process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app'
      }/shop\n\nHappy Shopping!\n- The WearFlare Team` // Plain text fallback

      await sendEmail({
        email: user.email,
        subject: welcomeSubject,
        message: welcomeText, // Pass text fallback
        html: welcomeHtml, // Pass HTML content
      })
      console.log(`Welcome email sent successfully to ${user.email}`)
    } catch (emailError) {
      // Log the error, but DO NOT stop the login process
      console.error(`Failed to send welcome email to ${user.email}:`, emailError)
      // We don't return an error response here because login itself was successful.
    }
    // --- End Welcome Email Attempt ---

    // --- Send successful login response ---
    res.json({
      // Status 200 is implicit
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: token,
      // Optionally include role if needed by frontend: role: user.role
    })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Server error during login.' })
  }
}

// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  // ... (forgotPassword code remains the same, ensure it uses HTML email)
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ message: 'Please provide an email address.' })
  }

  try {
    const user = await User.findOne({ email })
    if (!user) {
      console.log(`Forgot password attempt - Email not found: ${email}`)
      return res
        .status(200)
        .json({
          message: 'If an account with that email exists, a password reset link has been sent.',
        })
    }

    const rawResetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(rawResetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes
    await user.save({ validateBeforeSave: false })
    console.log(`Reset token generated for: ${user.email}`)

    const frontendBaseUrl =
      process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app'
    const resetURL = `${frontendBaseUrl}/reset-password/${rawResetToken}`

    // Prepare email content (Use generateEmailHtml helper or similar structure)
    const subject = 'Your Wearflare Password Reset Request (Valid for 10 min)'
    const emailContent = `
          <p>Hello ${user.fullName || 'there'},</p>
          <p>You requested a password reset for your Wearflare account. Please click the button below to set a new password:</p>
          <div class="button-container"><a href="${resetURL}" class="button" target="_blank">Reset Password</a></div>
          <p>This link is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `
    const htmlContent = generateWelcomeEmailHtml(user.fullName || 'there', 'Wearflare') // Re-use helper structure or create specific one
    const plainTextMessage = `Hello ${
      user.fullName || 'there'
    },\nYou requested a password reset. Click this link (valid 10 min): ${resetURL}\nIf you didn't request this, ignore this email.\n- Wearflare Team`

    try {
      await sendEmail({
        email: user.email,
        subject: subject,
        message: plainTextMessage,
        html: htmlContent,
      })
      console.log(`Password reset email sent to: ${user.email}`)
      res.status(200).json({ message: 'Password reset link sent successfully.' })
    } catch (emailError) {
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
  // ... (resetPassword code remains the same)
  try {
    const rawToken = req.params.token
    if (!rawToken) return res.status(400).json({ message: 'Reset token not provided.' })
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) {
      console.log(`Reset password attempt with invalid/expired token hash: ${hashedToken}`)
      return res.status(400).json({ message: 'Token is invalid or has expired.' })
    }

    const { password, passwordConfirm } = req.body
    if (!password || !passwordConfirm) {
      return res.status(400).json({ message: 'Please provide new password and confirmation.' })
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({ message: 'New passwords do not match.' })
    }

    user.password = password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save() // Trigger validation & hashing
    console.log(`Password successfully reset for user: ${user.email}`)

    const loginToken = generateToken(user._id)
    res
      .status(200)
      .json({
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
