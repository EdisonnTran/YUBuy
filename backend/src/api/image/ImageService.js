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

    createOne = async (image_url) => {
        await prisma.image.create({data: {
            name: image_url
        }})
    }

}

export const imageService = new ImageService();