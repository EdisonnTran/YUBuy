import prisma from '../../db/db.js'

export class MessageService {

    getOne = async (message_id) => {
        return await prisma.message.findUnique({
            where: {id: message_id}
        })
    }
    
    getMessages = async (listing_id) => {
        return await prisma.message.findMany({
            where: { listingId: listing_id }
        })
    }

    write = async (payload) => {
        return await prisma.message.create({data: {
            payload
        }})
    }

}

export const messageService = new MessageService();