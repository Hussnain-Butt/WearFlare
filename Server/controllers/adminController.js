// controllers/adminController.js
const Admin = require('../models/adminModel') // Make sure this path and model name are correct
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Order = require('../models/Order') // *** IMPORTANT: Import Order model ***
// const Product = require('../models/Product'); // Uncomment if needed for sales by plan

// Admin login function
const adminLogin = async (req, res) => {
  const { username, password } = req.body
  console.log(`[Admin Login Attempt] Username: ${username}`)

  try {
    const admin = await Admin.findOne({ username })
    if (!admin) {
      console.log(`[Admin Login Failed] Admin not found for username: ${username}`)
      return res.status(401).json({ message: 'Invalid credentials or server error.' })
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)
    if (!isPasswordValid) {
      console.log(`[Admin Login Failed] Invalid password for username: ${username}`)
      return res.status(401).json({ message: 'Invalid credentials or server error.' })
    }

    const payload = {
      id: admin._id,
      role: 'admin',
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ADMIN_EXPIRES_IN || '1h' }, // Consider separate expiry for admin
    )

    console.log(`[Admin Login Success] Token generated for username: ${username}`)
    return res.json({ token })
  } catch (error) {
    console.error('[Admin Login Server Error]', error)
    return res.status(500).json({ message: 'Server error during login process.' })
  }
}

// Fetch all users (Protected Route - Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.status(200).json(users)
  } catch (error) {
    console.error('[Get All Users Error]', error)
    res.status(500).json({ message: 'Server error fetching users.' })
  }
}

// Delete a user (Protected Route - Admin Only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    console.log(`[User Deleted] User ID: ${id} deleted by Admin: ${req.user?.id}`)
    res.status(200).json({ message: 'User deleted successfully.' })
  } catch (error) {
    console.error('[Delete User Error]', error)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format.' })
    }
    res.status(500).json({ message: 'Server error deleting user.' })
  }
}

// Update user info (Protected Route - Admin Only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { password, ...updateData } = req.body
    if (password) {
      console.warn(
        `[Update User Attempt] Attempted password update for user ${id} via general update route - blocked.`,
      )
      return res
        .status(400)
        .json({ message: 'Password updates are not allowed via this endpoint.' })
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password')

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' })
    }

    console.log(`[User Updated] User ID: ${id} updated by Admin: ${req.user?.id}`)
    res.status(200).json(updatedUser)
  } catch (error) {
    console.error('[Update User Error]', error)
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({ message: 'Invalid User ID format.' })
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((el) => el.message)
      return res.status(400).json({ message: `Validation Error: ${messages.join('. ')}` })
    }
    res.status(500).json({ message: 'Server error updating user.' })
  }
}

// --- DASHBOARD STATS ---

// 1. Get Key Metrics
const getDashboardKeyMetrics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentOrdersForMRR = await Order.find({
      status: { $in: ['Delivered', 'Confirmed'] },
      createdAt: { $gte: thirtyDaysAgo },
    })
    let currentMRR = recentOrdersForMRR.reduce((sum, order) => sum + order.totalPrice, 0)

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    const activeCustomerEmails = await Order.distinct('customerEmail', {
      createdAt: { $gte: ninetyDaysAgo },
      status: { $in: ['Pending', 'Confirmed', 'Shipped', 'Delivered'] }, // Consider active based on any recent engagement
    })
    const activeCustomersCount = activeCustomerEmails.length
    const activeCustomersPercentage = totalUsers > 0 ? (activeCustomersCount / totalUsers) * 100 : 0

    // Placeholder for Churn Rate - requires more complex historical data analysis
    const churnRate = 12 // Example: 12%

    res.status(200).json({
      currentMRR: currentMRR.toFixed(0),
      currentCustomers: totalUsers,
      activeCustomers: activeCustomersPercentage.toFixed(0),
      churnRate: churnRate,
    })
  } catch (error) {
    console.error('Error fetching key metrics:', error)
    res.status(500).json({ message: 'Failed to fetch key metrics.' })
  }
}

// 2. Get Revenue Trend Data
const getRevenueTrend = async (req, res) => {
  try {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const labels = []
    const revenueData = []
    const today = new Date()

    for (let i = 8; i >= 0; i--) {
      // Last 9 months
      const targetMonthDate = new Date(today.getFullYear(), today.getMonth() - i, 1)
      labels.push(monthNames[targetMonthDate.getMonth()])

      const startDate = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth(), 1)
      startDate.setHours(0, 0, 0, 0)

      const endDate = new Date(targetMonthDate.getFullYear(), targetMonthDate.getMonth() + 1, 0)
      endDate.setHours(23, 59, 59, 999)

      const monthOrders = await Order.find({
        status: { $in: ['Delivered', 'Confirmed'] },
        createdAt: { $gte: startDate, $lte: endDate },
      })
      const monthlyTotal = monthOrders.reduce((sum, order) => sum + order.totalPrice, 0)
      revenueData.push(monthlyTotal)
    }

    res.status(200).json({
      labels: labels,
      data: revenueData,
    })
  } catch (error) {
    console.error('Error fetching revenue trend:', error)
    res.status(500).json({ message: 'Failed to fetch revenue trend.' })
  }
}

// 3. Get Sales by Plan Data
const getSalesByPlan = async (req, res) => {
  try {
    // This is highly dependent on how you define "plans".
    // If 'category' in Product model represents plans:
    // const salesData = await Order.aggregate([
    //   { $match: { status: { $in: ['Delivered', 'Confirmed'] } } },
    //   { $unwind: '$orderItems' },
    //   {
    //     $lookup: {
    //       from: 'products', // Name of your products collection
    //       localField: 'orderItems.productId',
    //       foreignField: '_id',
    //       as: 'productInfo'
    //     }
    //   },
    //   { $unwind: '$productInfo' },
    //   {
    //     $group: {
    //       _id: '$productInfo.category', // Group by product category
    //       totalSales: { $sum: '$orderItems.price' } // Or $sum: 1 for count
    //     }
    //   },
    //   { $sort: { totalSales: -1 } }
    // ]);
    // const labels = salesData.map(item => item._id);
    // const data = salesData.map(item => item.totalSales);
    // // You might need to convert to percentages if required by pie chart

    // Using placeholder data as per original request
    res.status(200).json({
      labels: ['Basic', 'Pro', 'Enterprise'], // These should come from your data
      data: [40, 35, 25], // Placeholder percentages
    })
  } catch (error) {
    console.error('Error fetching sales by plan:', error)
    res.status(500).json({ message: 'Failed to fetch sales by plan.' })
  }
}

// 4. Get Recent Transactions (Orders)
const getRecentTransactions = async (req, res) => {
  try {
    const recentOrders = await Order.find({
      status: { $ne: 'Awaiting User Confirmation' },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('customerName totalPrice status createdAt') // Removed _id to prevent conflicts if not needed for key

    res.status(200).json(recentOrders)
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    res.status(500).json({ message: 'Failed to fetch recent transactions.' })
  }
}

// *** IMPORTANT: Update module.exports to include all functions ***
module.exports = {
  adminLogin,
  getAllUsers,
  deleteUser,
  updateUser,
  // Add dashboard functions here:
  getDashboardKeyMetrics,
  getRevenueTrend,
  getSalesByPlan,
  getRecentTransactions,
}
