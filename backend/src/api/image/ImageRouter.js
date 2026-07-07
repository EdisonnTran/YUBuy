import { Router } from 'express'
import { imageController } from './ImageController.js'

export const imageRouter = Router()

imageRouter.get('/', imageController.getAll)
imageRouter.get('/:id', imageController.getOne)
imageRouter.post('/', imageController.createOne)