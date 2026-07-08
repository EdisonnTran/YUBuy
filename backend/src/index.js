import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import wishlistRouter from './routes/wishlist.js'
import userRouter from './api/user/UserRouter.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (req, res) => res.send('YUBuy API is running'))

// Feature routes
app.use('/api/wishlist', wishlistRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
