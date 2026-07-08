import { Router } from 'express'
import { imageController } from './ImageController.js'

export const imageRouter = Router()

// GET: retrieve every image
imageRouter.get('/', imageController.getAll)

// GET: retrieve an image by its id
imageRouter.get('/:id', imageController.getOne)

// POST: create an image given an image URL
imageRouter.post('/', imageController.createOne)