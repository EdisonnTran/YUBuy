import { Router } from 'express'
import { ratingController } from './RatingController.js'

export const ratingRouter = Router()

ratingRouter.get('/listing/:id', ratingController.getByListing)
ratingRouter.get('/author/:id', ratingController.getByAuthor)
ratingRouter.get('/subject/:id', ratingController.getBySubject)
ratingRouter.post('/', ratingController.createRating)