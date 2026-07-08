import { Router } from 'express'
import { ratingController } from './RatingController.js'

export const ratingRouter = Router()

// GET: retrieve all ratings for a specific listing id
ratingRouter.get('/listing/:id', ratingController.getByListing)

// GET: retrieve all ratings for a specific author id
ratingRouter.get('/author/:id', ratingController.getByAuthor)

// GET: retrieve all ratings for a specific subject id
ratingRouter.get('/subject/:id', ratingController.getBySubject)

// POST: create a rating given its:
// score, comment, listingId, authorId, subjectId
ratingRouter.post('/', ratingController.createRating)