import { chatService } from "./ChatService.js"

export class ChatController {

    getChat = async (_req, res, next) => {
        try {
            const history = await chatService.getChatHistoryFromLake(_req.params.chatId)
            return res.status(200).send(history)
        } catch (error) {
            next(error)
        }
    }

    sendMessage = async (_req, res, next) => {
        try {
            const { senderId, text } = _req.body
            const message = { senderId, text }

            await chatService.appendMessageToLake(_req.params.chatId, message)
            return res.status(200).send(message)
        } catch (error) {
            next(error)
        }
    }
}

export const chatController = new ChatController()