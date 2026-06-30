import { Router } from 'express'
import { userExampleController } from './UserExampleController.js'

export const userExampleRouter = Router()

userExampleRouter.get('/', userExampleController.getUsers)
