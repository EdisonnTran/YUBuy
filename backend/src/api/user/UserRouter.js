import { Router } from 'express'
import { userController } from './UserController.js'

export const userRouter = Router()

userRouter.get('/', userController.getAll)
userRouter.get('/:id', userController.getOne)
userRouter.post('/', userController.createOne)
userRouter.post('/login', userController.verifyUser)
userRouter.post('/logout', userController.logout)