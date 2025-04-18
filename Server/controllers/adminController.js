// controllers/adminController.js
const Admin = require('../models/adminModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User') // Assuming you manage regular users too

// Admin login function
const adminLogin = async (req, res) => {
  const { username, password } = req.body
  console.log(`[Admin Login Attempt] Username: ${username}`) // Log the username being attempted

  try {
    // Find admin by username
    const admin = await Admin.findOne({ username })

    // Check if admin exists
    if (!admin) {
      console.log(`[Admin Login Failed] Admin not found for username: ${username}`)
      // Send a generic message for security, but log specific reason
      return res.status(401).json({ message: 'Invalid credentials or server error.' }) // Use 401 Unauthorized
    }

    // Compare submitted password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, admin.password)

    // Check if password is valid
    if (!isPasswordValid) {
      console.log(`[Admin Login Failed] Invalid password for username: ${username}`)
      // Send a generic message for security
      return res.status(401).json({ message: 'Invalid credentials or server error.' }) // Use 401 Unauthorized
    }

    // --- JWT Payload Update ---
    // Create JWT payload including the user ID and their role
    const payload = {
      id: admin._id,
      role: 'admin', // Explicitly set the role for admins
    }

    // Sign the JWT token
    const token = jwt.sign(
      payload, // Use the payload with id and role
      process.env.JWT_SECRET, // Ensure your JWT_SECRET is set in .env
      { expiresIn: '1h' }, // Token expiration time (e.g., 1 hour)
    )

    console.log(`[Admin Login Success] Token generated for username: ${username}`)
    // Return only the token (frontend handles storing role based on login route)
    // Or you could return role too if needed: res.json({ token, role: 'admin' })
    return res.json({ token })
  } catch (error) {
    // Log the actual server error for debugging
    console.error('[Admin Login Server Error]', error)
    // Send a generic server error message to the client
    return res.status(500).json({ message: 'Server error during login process.' })
  }
}

// Fetch all users (Protected Route - Admin Only)
const getAllUsers = async (req, res) => {
  // The 'protect' middleware should have already verified the admin role
  try {
    // Find all users, excluding their passwords
    const users = await User.find().select('-password') // Exclude password field
    res.status(200).json(users) // Use 200 OK status
  } catch (error) {
    console.error('[Get All Users Error]', error)
    res.status(500).json({ message: 'Server error fetching users.' })
  }
}

// Delete a user (Protected Route - Admin Only)
const deleteUser = async (req, res) => {
  // The 'protect' middleware should have already verified the admin role
  try {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    console.log(`[User Deleted] User ID: ${id} deleted by Admin: ${req.user?.id}`) // Log who deleted (if req.user is attached by middleware)
    res.status(200).json({ message: 'User deleted successfully.' }) // Use 200 OK status
  } catch (error) {
    console.error('[Delete User Error]', error)
    // Handle potential CastError for invalid ID format
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format.' })
    }
    res.status(500).json({ message: 'Server error deleting user.' })
  }
}

// Update user info (Protected Route - Admin Only)
const updateUser = async (req, res) => {
  // The 'protect' middleware should have already verified the admin role
  try {
    const { id } = req.params
    // Prevent password updates through this generic endpoint for security
    // If password update is needed, create a separate, dedicated route/controller
    const { password, ...updateData } = req.body
    if (password) {
      console.warn(
        `[Update User Attempt] Attempted password update for user ${id} via general update route - blocked.`,
      )
      return res
        .status(400)
        .json({ message: 'Password updates are not allowed via this endpoint.' })
    }

    // Find user by ID and update, return the updated document, run validators
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true, // Return the modified document rather than the original
      runValidators: true, // Ensure schema validations are run
    }).select('-password') // Exclude password from the returned object

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    console.log(`[User Updated] User ID: ${id} updated by Admin: ${req.user?.id}`)
    res.status(200).json(updatedUser) // Use 200 OK status and send updated user
  } catch (error) {
    console.error('[Update User Error]', error)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format.' })
    }
    // Handle Mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((el) => el.message)
      return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}` })
    }
    res.status(500).json({ message: 'Server error updating user.' })
  }
}

module.exports = {
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUser,
}
