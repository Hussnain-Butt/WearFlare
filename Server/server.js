const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')

// Import DB & Routes
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const productRoutes = require('./routes/productRoutes')
const tryonRoutes = require('./routes/tryonRoutes')

// Initialize App
const app = express()

// Load Environment Variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Create upload directories if not exist
const uploadPaths = ['uploads', 'uploads/photos', 'uploads/models', 'uploads/configs']
uploadPaths.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
})

// -------------------------------
// ✅ CORS Middleware Setup
// -------------------------------
app.use(
  cors({
    origin: [
      'https://frontend-production-0ee2.up.railway.app',
      'https://backend-production-c8ff.up.railway.app',
    ],
    credentials: true,
  }),
)

// ✅ Manually Set CORS Headers (for extra assurance)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})

// ✅ Preflight Requests Handling
app.options('*', cors())

// -------------------------------
// ✅ Parsers & Static Setup
// -------------------------------
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// -------------------------------
// ✅ Routes Setup
// -------------------------------
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/tryon', tryonRoutes)

// -------------------------------
// ✅ Server Listen
// -------------------------------
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`)
})
