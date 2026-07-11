import prisma from '../../db/db.js'

export class RatingService {

    getByListing = async (id) => {
        return await prisma.rating.findMany({
            where: {listingId: id}
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
            payload
        }})
    }

}

export const ratingService = new RatingService();