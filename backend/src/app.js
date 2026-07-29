import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { wishlistRouter } from './api/wishlist/WishlistRouter.js'
import session from 'express-session'
import { userExampleRouter } from './api/user_example/UserExampleRouter.js'
import { categoryRouter } from './api/category/CategoryRouter.js'
import { imageRouter } from './api/image/ImageRouter.js'
import { userRouter } from './api/user/UserRouter.js'
import { listingRouter } from './api/listing/ListingRouter.js'
import { messageRouter } from './api/message/MessageRouter.js'
import { ratingRouter } from './api/rating/RatingRouter.js'

const app = express()

const isProduction = process.env.NODE_ENV === 'production'
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'

app.use(cors({
    origin: frontendUrl,
    credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
        httpOnly: true,
        secure: isProduction,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        sameSite: isProduction ? 'none' : 'lax',
        }
    })
)

// Health check
app.get('/', (req, res) => res.send('YUBuy API is running'))
app.get('/version-check', (req, res) => res.send('gmail-api-v2-c526bfc'))

// Feature routes
app.use('/api/wishlist', wishlistRouter)
app.use('/api/test', userExampleRouter)
app.use('/api/category', categoryRouter)
app.use('/api/image', imageRouter)
app.use('/api/user', userRouter)
app.use('/api/listing', listingRouter)
app.use('/api/message', messageRouter)
app.use('/api/rating', ratingRouter)
app.use('/api/user', userRouter)

app.use((err, _req, res, _next) => {
    // console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
})

export default app
