import { messageService } from "./MessageService.js";

export class MessageController {

    getOne = async (_req, res, next) => {
        try {
            const message_id = _req.params.id

            const message = await messageService.getOne(message_id)
            res.status(200).send(message)
        }
        catch (error) {
            next(error);
        }
    }

    getChat = async (_req, res, next) => {
        try {
            const listing_id = _req.params.id
            
            const messages = await messageService.getMessages(listing_id)
            res.status(200).send(messages)
        }
        catch (error) {
            next(error);
        }
    }

    writeOne = async (_req, res, next) => {
        try {
            const payload = {
                content: _req.body.content,
                listingId: _req.body.listingId,
                senderId: _req.body.senderId,
                receiverId: _req.body.receiverId
            }

            const serviceResponse = await messageService.write(payload)
            res.status(200).send(serviceResponse)
        }
        catch (error) {
            next(error);
        }
    }

}

export const messageController = new MessageController()