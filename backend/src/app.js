import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { wishlistRouter } from './api/wishlist/WishlistRouter.js'
import { userExampleRouter } from './api/user_example/UserExampleRouter.js'
import { categoryRouter } from './api/category/CategoryRouter.js'
import { imageRouter } from './api/image/ImageRouter.js'
import { userRouter } from './api/user/UserRouter.js'
import { listingRouter } from './api/listing/ListingRouter.js'
import { messageRouter } from './api/message/MessageRouter.js'
import { ratingRouter } from './api/rating/RatingRouter.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/', (req, res) => res.send('YUBuy API is running'))

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

export default app