import { Router } from 'express'
import { userController } from './UserController.js'

export const userRouter = Router()

// GET: retrieve all users
userRouter.get('/', userController.getAll)

// GET: retrieve a user by its id
userRouter.get('/:id', userController.getOne)

// POST: create a user given its email, password, name
userRouter.post('/', userController.createOne)

// POST: logs a user in by checking if its credentials match
userRouter.post('/login', userController.verifyUser)

// POST: logs a user out (only if they were previously logged in)
userRouter.post('/logout', userController.logout)