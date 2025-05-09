import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import emojis from './emojis.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.get('/', (request, response) => {
  response.json({
    message: 'railway conductor',
    emoji: emojis.random()
  })
})

// Error handling
app.use((error, request, response, next) => {
  console.error(error.stack)
  response.status(500).json({ error: '(ノдヽ)' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🔮 Server running on port ${PORT}`)
})