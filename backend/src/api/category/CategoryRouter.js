import { Router } from 'express'
import { categoryController } from './CategoryController.js'

export const categoryRouter = Router()

// GET: retrieve every category
categoryRouter.get('/', categoryController.getAll)

// GET: retrieve a category by its ID: /category/
categoryRouter.get('/:id', categoryController.getOne)

// POST: create a category given a category name
categoryRouter.post('/', categoryController.createOne)