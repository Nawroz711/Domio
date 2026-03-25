import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './src/config/mongodb.js'
import { globalLimiter } from './src/middlewares/rateLimiter.js'
import userRoutes from './src/routes/user.routes.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization' , 'x-user-id'],
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve uploaded files
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use(globalLimiter)

app.get('/', (_req, res) => {
  res.send('Backend is running')
})

// ROUTES
app.use('/api/users', userRoutes)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Server failed to start:', error.message)
    process.exit(1)
  }
}

startServer()
