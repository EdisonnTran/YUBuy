import { Router } from 'express'
import { messageController } from './MessageController.js'

export const messageRouter = Router()

// GET: retrieve a message by the message's id
messageRouter.get('/:id', messageController.getOne)

// GET: retrieve a chat (list of messages) for a particular listing
messageRouter.get('/listing/:id', messageController.getChat)

// POST: create a message given a message's:
// content, listingId, senderId, receiverId
messageRouter.post('/', messageController.writeOne)