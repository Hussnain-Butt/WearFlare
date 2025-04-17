// controllers/authController.js

const User = require('../models/User') // Ensure path is correct
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail') // Ensure path is correct
const dotenv = require('dotenv')

dotenv.config() // Assumes .env is in the project root

// --- generateToken, registerUser, loginUser (Keep as they are) ---
const generateToken = (id) => {
  /* ... */
}
const registerUser = async (req, res) => {
  /* ... */
}
const loginUser = async (req, res) => {
  /* ... */
}

// --- FORGOT PASSWORD ---
const forgotPassword = async (req, res) => {
  try {
    // 1) Get user by email
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      console.log(`Forgot password attempt - Email not found: ${req.body.email}`)
      return res.status(200).json({
        message: 'If an account with that email exists, a password reset link has been sent.',
      })
    }

    // 2) Generate raw token and its hashed version
    const rawResetToken = crypto.randomBytes(32).toString('hex')
    const hashedResetToken = crypto.createHash('sha256').update(rawResetToken).digest('hex')

    // 3) Set token and expiry on user document
    user.resetPasswordToken = hashedResetToken
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save({ validateBeforeSave: false })
    console.log(`Reset token generated and saved for user: ${user.email}`)

    // 4) Construct Reset URL (using the RAW token)
    const frontendBaseUrl =
      process.env.FRONTEND_URL || 'https://frontend-production-c902.up.railway.app' // Fallback
    // --- CRITICAL: Ensure FRONTEND_URL is set correctly in .env ---
    if (!process.env.FRONTEND_URL) {
      console.warn(
        'WARN: FRONTEND_URL is not set in environment variables. Using default localhost.',
      )
    }
    const resetURL = `${frontendBaseUrl}/reset-password/${rawResetToken}`
    const currentYear = new Date().getFullYear()

    // 5) Prepare Email Content (HTML and Plain Text)
    // --- VERIFY THIS HTML CONTENT ---
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head> <meta charset="UTF-8" /> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Password Reset - Wearflare</title> <style> body { margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; color: #333; } .email-wrapper { background-color: #ffffff; max-width: 600px; margin: 40px auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.07); border: 1px solid #eee; } .header { background-color: #c8a98a; /* Primary color */ color: #ffffff; padding: 25px 30px; text-align: center; } .header h1 { margin: 0; font-size: 24px; font-weight: 600; } .content { padding: 30px 35px; font-size: 15px; line-height: 1.7; color: #555; } .content p { margin: 0 0 15px 0; } .button-container { text-align: center; margin: 25px 0; } .button { display: inline-block; padding: 12px 25px; background-color: #6b5745; /* Darker accent */ color: #ffffff !important; /* Important for email clients */ text-decoration: none; font-weight: bold; border-radius: 5px; font-size: 15px; transition: background-color 0.3s ease; } .button:hover { background-color: #5d4c3b; } .link-container { margin-top: 20px; font-size: 13px; word-break: break-all; } .link { color: #4a90e2; text-decoration: none; } .footer { text-align: center; font-size: 12px; color: #999; padding: 20px 30px; border-top: 1px solid #eee; background-color: #f9f9f9; } </style></head>
    <body>
      <div class="email-wrapper">
        <div class="header"> <h1>Wearflare</h1> </div>
        <div class="content">
          <p>Hello ${user.fullName || 'there'},</p>
          <p>We received a request to reset the password for your Wearflare account associated with this email address.</p>
          <p>If you made this request, please click the button below to choose a new password. This link is only valid for the next <strong>10 minutes</strong>.</p>
          <div class="button-container"> <a class="button" href="${resetURL}" target="_blank" style="color: #ffffff;">Reset Your Password</a> </div>
          <p>If you didn’t request a password reset, you can safely ignore this email. Your password won't be changed.</p>
          <div class="link-container"> <p>If the button above doesn't work, copy and paste this link into your browser:</p> <a href="${resetURL}" class="link">${resetURL}</a> </div>
        </div>
        <div class="footer"> © ${currentYear} Wearflare. All rights reserved. </div>
      </div>
    </body>
    </html>
    `
    // --- END HTML CONTENT ---

    // --- VERIFY THIS PLAIN TEXT CONTENT ---
    const plainTextMessage = `
    Hello ${user.fullName || 'there'},

    We received a request to reset the password associated with this email address for your Wearflare account.

    If you made this request, please use the following link to set a new password:
    ${resetURL}

    This link is valid for 10 minutes.

    If you did not request a password reset, please ignore this email. Your password will remain unchanged.

    If you're having trouble with the link, please paste it into your web browser.

    Thanks,
    The Wearflare Team
    © ${currentYear} Wearflare. All rights reserved.
    `
    // --- END PLAIN TEXT CONTENT ---

    // 6) Send the Email using BOTH `message` and `html` options
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your Wearflare Password Reset Request (Valid for 10 min)',
        message: plainTextMessage, // Ensure this property name matches your sendEmail utility
        html: htmlContent, // Ensure this property name matches your sendEmail utility
      })
      console.log(`Password reset email successfully sent to: ${user.email}`)
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

// --- resetPassword (Keep as is, assuming it worked before) ---
const resetPassword = async (req, res) => {
  /* ... */
}

// --- Export all controller functions ---
module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
}
