import { Router } from 'express'
import { categoryController } from './CategoryController.js'

export const categoryRouter = Router()

categoryRouter.get('/', categoryController.getAll)
categoryRouter.get('/:id', categoryController.getOne)
categoryRouter.post('/', categoryController.createOne)