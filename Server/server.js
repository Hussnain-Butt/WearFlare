import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bodyParser from 'body-parser'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import adminRoutes from './routes/adminRoutes.js'

dotenv.config()
connectDB()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)

app.use('/admin', adminRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
