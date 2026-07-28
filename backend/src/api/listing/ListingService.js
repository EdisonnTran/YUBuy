import prisma from '../../db/db.js'

export class ListingService {
    
    getAll = async ({ search, category } = {}) => {
        const where = { status: 'ACTIVE' }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ]
        }

        if (category) {
            where.category = { name: { equals: category, mode: 'insensitive' } }
        }

        return await prisma.listing.findMany({
            where,
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
            ...payload
        }})
    }

    deleteOne = async (listing_id) => {
        return await prisma.listing.delete({
            where: {id: listing_id}
        })
    }

}

export const listingService = new ListingService();
