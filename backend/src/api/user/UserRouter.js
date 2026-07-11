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

// POST: sends a password reset link to the user's email
userRouter.post('/forgot-password', userController.forgotPassword)

// POST: resets the user's password using the token from the reset link
userRouter.post('/reset-password', userController.resetPassword)

// POST: sends a 6 digit 2FA verificstion code to the user's email
userRouter.post('/send-code', userController.sendVerificationCode)

// POST: verifies the 6 digit code once entered by user
userRouter.post('/verify-code', userController.verifyCode)