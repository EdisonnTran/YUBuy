import { Router } from 'express'
import { chatController } from './ChatController.js'

export const chatRouter = Router()

// GET: retrieve all chatIds for a user
chatRouter.get('/user/:userId', chatController.getChatsForUser)

// GET: retrieve a chat by chatId
chatRouter.get('/:chatId', chatController.getChat)

// POST: send a message to a chatId
chatRouter.post('/:chatId', chatController.sendMessage)

