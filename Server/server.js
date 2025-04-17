// server.js
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
// const bodyParser = require('body-parser'); // Deprecated for included parsers
const path = require('path')
const fs = require('fs')

// Import DB & Routes
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const managerRoutes = require('./routes/productManagerRoutes')

const productRoutes = require('./routes/productRoutes')
const tryonRoutes = require('./routes/tryonRoutes')
const orderRoutes = require('./routes/orderRoutes')
const contactRoutes = require('./routes/contactRoutes') // *** ADD THIS LINE ***
const newsletterRoutes = require('./routes/newsletterRoutes') // *** ADD THIS LINE ***

// Initialize App
const app = express()
console.log('--- Application Initializing ---')

// Load Environment Variables
dotenv.config()
console.log('--- Environment variables loaded (dotenv) ---')

// Connect to MongoDB
connectDB() // Assuming this logs its status

// Create upload directories if they don't exist
// IMPORTANT: Ensure 'uploads/userImages' is included and created.
const uploadPaths = [
  'uploads',
  'uploads/userImages',
  'uploads/photos',
  'uploads/models',
  'uploads/configs',
]
console.log('--- Ensuring upload directories exist ---')
uploadPaths.forEach((dir) => {
  const fullPath = path.join(__dirname, dir)
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`)
    try {
      fs.mkdirSync(fullPath, { recursive: true })
    } catch (err) {
      console.error(`❌ FAILED to create directory: ${fullPath}`, err)
      // Consider exiting if essential directories can't be made
      // process.exit(1);
    }
  }
})
console.log('--- Upload directories checked/created ---')

// -------------------------------
// ✅ Health Check Endpoint
// -------------------------------
app.get('/health', (req, res) => {
  console.log('--- Received request on /health endpoint ---')
  res.status(200).send('OK - Server is responding')
})
console.log('--- Health check endpoint registered (/health) ---')

// -------------------------------
// ✅ CORS Middleware Setup (UPDATED)
// -------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'https://backend-production-c8ff.up.railway.app/',
  'https://frontend-production-c902.up.railway.app',
]

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (
        allowedOrigins.includes(origin) ||
        /\.railway\.app$/.test(origin) // allow any Railway app
      ) {
        return callback(null, true)
      }
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      return callback(new Error(msg), false)
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
)
console.log('--- CORS middleware applied ---')

// -------------------------------
// ✅ Parsers & Static Setup
// -------------------------------
// Set limits to prevent large payloads, adjust as needed
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Serve static uploads from the 'uploads' directory
console.log('--- Setting up static file serving for /uploads ---')
const staticUploadsPath = path.join(__dirname, 'uploads')
console.log(`Serving static files from absolute path: ${staticUploadsPath}`)
// Test if directory exists before serving
if (fs.existsSync(staticUploadsPath)) {
  app.use('/uploads', express.static(staticUploadsPath))
  console.log('--- Static file serving configured for /uploads ---')
} else {
  console.error(
    `❌ ERROR: Static files directory does not exist: ${staticUploadsPath}. File URLs will fail.`,
  )
}

// -------------------------------
// ✅ Routes Setup
// -------------------------------
console.log('--- Registering API routes ---')
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/manager', managerRoutes)

app.use('/api/orders', orderRoutes) // *** ADD THIS LINE ***
app.use('/api/tryon', tryonRoutes) // Uses tryonRoutes.js
app.use('/api/contact', contactRoutes) // *** ADD THIS LINE ***
app.use('/api/newsletter', newsletterRoutes) // *** ADD THIS LINE ***
console.log('--- API routes registered ---')

// -------------------------------
// Global Error Handler (Catches errors from routes/middleware)
// -------------------------------
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler Caught Error ---')
  console.error(`Error Path: ${req.path}`)
  console.error(`Error Message: ${err.message}`)
  console.error(err.stack) // Full stack trace

  // Avoid sending stack trace in production
  const statusCode = err.status || 500
  res.status(statusCode).json({
    error: 'An unexpected error occurred on the server.',
    // Optionally include more detail in development
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

// -------------------------------
// ✅ Server Listen
// -------------------------------
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`✅ Server running and listening on port ${PORT}`)
})
