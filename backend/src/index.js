import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import listingsRouter from './routes/listings.js'
import wishlistRouter from './routes/wishlist.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (req, res) => res.send('YUBuy API is running'))

// Feature routes
app.use('/api/wishlist', wishlistRouter)
app.use('/api/listings', listingsRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
