import prisma from '../../db/db.js'

export class ImageService {
    
    getAll = async () => {
        return await prisma.image.findMany()
    }

    getOne = async (image_id) => {
        return await prisma.image.findUnique({
            where: {id: image_id}
        })
    }

    createOne = async (payload) => {
        return await prisma.image.create({data: {
            url: payload.image_url,
            listingId: payload.listingId
        }})
    }

}

export const imageService = new ImageService();