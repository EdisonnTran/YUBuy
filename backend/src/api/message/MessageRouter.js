import { Router } from 'express'
import { messageController } from './MessageController.js'

export const messageRouter = Router()

messageRouter.get('/:id', messageController.getOne)
messageRouter.get('/listing/:id', messageController.getChat)
messageRouter.post('/', messageController.writeOne)