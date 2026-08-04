import prisma from '../../db/db.js'

export class RatingService {

    getByListing = async (id) => {
        return await prisma.rating.findMany({
            where: { listingId: id },
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        })
    }
    getByAuthor = async (id) => {
        return await prisma.rating.findMany({
            where: {authorId: id}
        })
    }

    getBySubject = async (id) => {
        return await prisma.rating.findMany({
            where: {subjectId: id}
        })
    }

    createOne = async (payload) => {
        return await prisma.rating.create({data: {
            ...payload
        }})
    }

    updateOne = async (id, data) => {
    return await prisma.rating.update({
        where: { id },
        data
    })
}

}

export const ratingService = new RatingService();