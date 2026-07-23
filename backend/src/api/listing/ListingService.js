import prisma from '../../db/db.js'

export class ListingService {
    
    getAll = async () => {
        return await prisma.listing.findMany({
            where: { status: 'ACTIVE' },
            orderBy: { createdAt: 'desc' },
            include: {
                images: true,
                category: true,
                seller: { select: { id: true, name: true }}
            }
        })
    }

    getOne = async (listing_id) => {
        return await prisma.listing.findUnique({
            where: {id: listing_id},
            include: {
                images: true,
                category: true,
                seller: { select: { id: true, name: true }}
            }
        })
    }

    getByCategory = async (category_id) => {
        return await prisma.listing.findMany({
            where: {categoryId: category_id},
            orderBy: { createdAt: 'desc' },
            include: {
                images: true,
                category: true,
                seller: { select: { id: true, name: true }}
            }
        })
    }

    getBySeller = async (seller_id) => {
        return await prisma.listing.findMany({
            where: {sellerId: seller_id},
            orderBy: { createdAt: 'desc' },
            include: {
                images: true,
                category: true,
                seller: { select: { id: true, name: true }}
            }
        })
    }

    createOne = async (payload) => {
        return await prisma.listing.create({data: {
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