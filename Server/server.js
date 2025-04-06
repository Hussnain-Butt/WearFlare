// server.js
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
console.log('--- Application Initializing ---') // Log: App init

// Load Environment Variables
dotenv.config()
console.log('--- Environment variables loaded (dotenv) ---') // Log: Env loaded

// Connect to MongoDB
connectDB() // Assuming this logs success/failure internally

// Create upload directories if not exist
const uploadPaths = [
  'uploads',
  'uploads/userImages',
  'uploads/photos',
  'uploads/models',
  'uploads/configs',
] // Added userImages
console.log('--- Ensuring upload directories exist ---') // Log: Check dirs
uploadPaths.forEach((dir) => {
  const fullPath = path.join(__dirname, dir) // Use absolute path for checking/creating
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`) // Log: Creating dir
    fs.mkdirSync(fullPath, { recursive: true })
  }
})
console.log('--- Upload directories checked/created ---') // Log: Dirs done

// -------------------------------
// ✅ Health Check Endpoint (BEFORE CORS/Routes for simplicity)
// -------------------------------
app.get('/health', (req, res) => {
  console.log('--- Received request on /health endpoint ---') // Log: Health check hit
  res.status(200).send('OK - Server is responding')
})
console.log('--- Health check endpoint registered ---') // Log: Health route registered

// -------------------------------
// ✅ CORS Middleware Setup
// -------------------------------
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://frontend-production-c902.up.railway.app',
]
console.log('--- Configuring CORS with allowed origins:', allowedOrigins) // Log: CORS config

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.'
      console.error(`CORS Error: Origin ${origin} not allowed.`) // Log CORS block
      return callback(new Error(msg), false)
    }
    return callback(null, true)
  },
  credentials: true,
}
app.use(cors(corsOptions))

// Optional: Preflight Requests Handling (cors middleware usually handles this)
// app.options('*', cors(corsOptions)); // You might not need this explicit line

console.log('--- CORS middleware applied ---') // Log: CORS applied

// -------------------------------
// ✅ Parsers & Static Setup
// -------------------------------
// IMPORTANT: Limit request size if needed, especially for file uploads
app.use(express.json({ limit: '10mb' })) // Increased limit for potential base64? Or keep reasonable
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
// bodyParser is deprecated for json/urlencoded, included above. Remove if not used otherwise.
// app.use(bodyParser.json());

// Serve static uploads - IMPORTANT: Ensure this path is correct relative to where server runs
console.log('--- Setting up static file serving for /uploads ---') // Log: Static setup
const staticUploadsPath = path.join(__dirname, 'uploads')
console.log(`Serving static files from: ${staticUploadsPath}`) // Log: Static path
app.use('/uploads', express.static(staticUploadsPath))
console.log('--- Static file serving configured ---') // Log: Static done

// -------------------------------
// ✅ Routes Setup
// -------------------------------
console.log('--- Registering API routes ---') // Log: Route registration start
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/tryon', tryonRoutes) // This uses tryonRoutes.js
console.log('--- API routes registered ---') // Log: Route registration end

// Optional: Global Error Handler (Basic Example)
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler Caught Error ---') // Log: Global error caught
  console.error(err.stack)
  res.status(500).send('Something broke on the server!')
})

// -------------------------------
// ✅ Server Listen
// -------------------------------
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  // This log confirms the server *started* listening, not necessarily that it's healthy
  console.log(`✅ Server running and listening on port ${PORT}`)
})
