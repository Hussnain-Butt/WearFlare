const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const productRoutes = require('./routes/productRoutes') // This was missing from your original import

const app = express()

const uploadPaths = ['uploads', 'uploads/photos', 'uploads/models', 'uploads/configs']

uploadPaths.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})
// Load environment variables
dotenv.config()

// Connect to the database
connectDB()

// Middleware to parse JSON and urlencoded data
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Enable CORS
app.use(cors())
app.use(bodyParser.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
