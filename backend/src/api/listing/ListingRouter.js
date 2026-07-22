import { Router } from 'express'
import { listingController } from './ListingController.js'

export const listingRouter = Router()

// GET: retrieve every listing
listingRouter.get('/', listingController.getAll)

// GET: retrieve a listing by its id
listingRouter.get('/:id', listingController.getOne)

// GET: retrieve a listing by its category
listingRouter.get('/category/:id', listingController.getByCategory)

// GET: retrieve a listing by its seller
listingRouter.get('/seller/:id', listingController.getBySeller)

// POST: create a listing given the listing's
// title, description, price, proximity, sellerId, category
listingRouter.post('/', listingController.createOne)

// DELETE: delete a listing given the listing's id
listingRouter.delete('/', listingController.deleteOne)