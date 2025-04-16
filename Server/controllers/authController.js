const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto') // Import crypto
const sendEmail = require('../utils/sendEmail') // Import the email utility
const dotenv = require('dotenv')

dotenv.config({ path: './.env' }) // Ensure .env is loaded correctly

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' })
}

// **REGISTER USER**
const registerUser = async (req, res) => {
  // ... (your existing registerUser code - unchanged)
  try {
    const { fullName, email, password } = req.body

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser)
      return res.status(400).json({ message: 'User already exists with this email' })

    // Password validation (example)
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' })
    }

    const user = await User.create({ fullName, email, password })

    // Don't send password back, even hashed
    user.password = undefined

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Register Error:', error)
    // Check for Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join('. ') })
    }
    res.status(500).json({ message: 'Server Error during registration' })
  }
}

// **LOGIN USER**
const loginUser = async (req, res) => {
  // ... (your existing loginUser code - unchanged)
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Explicitly select the password field as it's hidden by default
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      // Generic message for security
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Use the comparePassword method or bcrypt.compare directly
    const isMatch = await bcrypt.compare(password, user.password) // Direct comparison
    if (!isMatch) {
      // Generic message for security
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Don't send password back
    user.password = undefined

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.error('Login Error:', error)
    res.status(500).json({ message: 'Server Error during login' })
  }
}

// **FORGOT PASSWORD**
const forgotPassword = async (req, res) => {
  try {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      console.log(`Forgot password attempt for non-existent email: ${req.body.email}`)
      // Don't reveal if the user exists or not
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // 2) Generate token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save({ validateBeforeSave: false })

    // 3) Create Reset URL
    // IMPORTANT: Ensure FRONTEND_URL in .env DOES NOT end with a slash
    const resetURL = `https://frontend-production-c902.up.railway.app/reset-password/${resetToken}`
    const currentYear = new Date().getFullYear()

    // 4) Define HTML Email Content (using template literal)
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f7f7f7;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.05);
          padding: 40px 30px;
        }
        .header {
          text-align: center;
          padding-bottom: 20px;
        }
        .header h1 {
          color: #c8a98a;
          margin: 0;
        }
        .content {
          font-size: 16px;
          line-height: 1.6;
        }
        .button {
          display: inline-block;
          margin: 30px 0;
          padding: 12px 30px;
          background-color: #c8a98a;
          color: #fff;
          text-decoration: none;
          font-weight: bold;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .button:hover {
          background-color: #b08d67;
        }
        .footer {
          text-align: center;
          font-size: 13px;
          color: #999;
          padding-top: 30px;
          border-top: 1px solid #eee;
        }
        .link {
          word-break: break-all;
          color: #555;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Wearflare</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset the password for your Wearflare account.</p>
          <p>If you made this request, click the button below to choose a new password:</p>
          <p style="text-align: center;">
            <a class="button" href="${resetURL}" target="_blank">Reset Password</a>
          </p>
          <p>This link is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn’t request a password reset, please ignore this email. Your password will remain unchanged.</p>
          <p>If you’re having trouble, paste this link into your browser:</p>
          <p class="link">${resetURL}</p>
        </div>
        <div class="footer">
          &copy; ${currentYear} Wearflare. All rights reserved.
        </div>
      </div>
    </body>
    </html>
    `

    // 5) Define Plain Text Fallback Message
    const plainTextMessage = `
    Hello,
    
    We received a request to reset the password associated with this email address for your Wearflare account.
    
    If you made this request, please use the following link to set a new password:
    ${resetURL}
    
    This link is valid for 10 minutes.
    
    If you did not request a password reset, please ignore this email. Your password will remain unchanged.
    
    If you're having trouble with the link, please paste it into your web browser.
    
    Thanks,
    The Wearflare Team
    `

    // 6) Send Email
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Wearflare Password Reset Request (Valid for 10 min)',
        message: plainTextMessage, // Plain text version
        html: htmlContent, // HTML version
      })

      res.status(200).json({ message: 'Password reset link sent to your email.' })
    } catch (err) {
      // If email sending fails, reset the token fields
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
      await user.save({ validateBeforeSave: false })

      console.error('EMAIL SENDING ERROR:', err)
      // Send a generic error to the client
      return res.status(500).json({
        message: 'There was an error sending the password reset email. Please try again later.',
      })
    }
  } catch (error) {
    console.error('FORGOT PASSWORD CONTROLLER ERROR:', error)
    // Avoid sending specific error details to the client
    res
      .status(500)
      .json({ message: 'An internal error occurred while processing the forgot password request.' })
  }
}

// **RESET PASSWORD**
const resetPassword = async (req, res) => {
  // ... (your existing resetPassword code - unchanged)
  try {
    // 1) Get user based on the token (hashed version)
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token) // Get token from URL params
      .digest('hex')

    // Find user by hashed token and ensure token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // Check if expiry date is greater than now
    })

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired.' })
    }

    // Check if new password is provided
    if (!req.body.password || req.body.password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Please provide a new password with at least 6 characters.' })
    }
    // Optional: Add password confirmation check
    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).json({ message: 'Passwords do not match.' })
    }

    // 3) Update password, clear token fields on the user document
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save() // Mongoose 'save' middleware will automatically hash the new password

    // 4) Log the user in, send JWT
    const loginToken = generateToken(user._id)

    res.status(200).json({
      message: 'Password reset successful!',
      token: loginToken, // Optionally log them in immediately
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
    })
  } catch (error) {
    console.error('RESET PASSWORD ERROR:', error)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message)
      return res.status(400).json({ message: messages.join('. ') })
    }
    res.status(500).json({ message: 'An error occurred while resetting the password.' })
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword, // Export new function
  resetPassword, // Export new function
}
