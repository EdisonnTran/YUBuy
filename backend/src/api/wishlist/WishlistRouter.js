import { Router } from 'express'
import { wishlistController } from './WishlistController.js'

export const wishlistRouter = Router()

// GET: retrieve every listing a user has saved
wishlistRouter.get('/:userId', wishlistController.getAllForUser)

// POST: save a listing to a user's wishlist
wishlistRouter.post('/', wishlistController.addOne)

// DELETE: remove a listing from a user's wishlist
wishlistRouter.delete('/', wishlistController.removeOne)
