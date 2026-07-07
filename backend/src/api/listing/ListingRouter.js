import { Router } from 'express'
import { listingController } from './ListingController.js'

export const listingRouter = Router()

listingRouter.get('/', listingController.getAll)
listingRouter.get('/:id', listingController.getOne)
listingRouter.post('/', listingController.createOne)
listingRouter.delete('/', listingController.deleteOne)