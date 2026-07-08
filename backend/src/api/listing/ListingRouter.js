import { Router } from 'express'
import { listingController } from './ListingController.js'

export const listingRouter = Router()

// GET: retrieve every listing
listingRouter.get('/', listingController.getAll)

// GET: retrieve a listing by its id
listingRouter.get('/:id', listingController.getOne)

// POST: create a listing given the listing's
// title, description, price, proximity, sellerId
listingRouter.post('/', listingController.createOne)

// DELETE: delete a listing given the listing's id
listingRouter.delete('/', listingController.deleteOne)