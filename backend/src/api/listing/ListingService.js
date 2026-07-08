import prisma from '../../db/db.js'

export class ListingService {
    
    getAll = async () => {
        return await prisma.listing.findMany()
    }

    getOne = async (listing_id) => {
        return await prisma.listing.findUnique({
            where: {id: listing_id}
        })
    }

    getByCategory = async (category_id) => {
        return await prisma.listing.findMany({
            where: {categoryId: category_id}
        })
    }

    getBySeller = async (seller_id) => {
        return await prisma.listing.findMany({
            where: {sellerId: seller_id}
        })
    }

    createOne = async (payload) => {
        await prisma.listing.create({data: {
            payload
        }})
    }

    deleteOne = async (listing_id) => {
        return await prisma.listing.delete({
            where: {id: listing_id}
        })
    }

}

export const listingService = new ListingService();