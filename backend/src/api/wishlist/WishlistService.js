import prisma from '../../db/db.js'

export class WishlistService {

    getAllForUser = async (user_id) => {
        const user = await prisma.user.findUnique({
            where: { id: user_id },
            include: {
                wishlist: {
                    include: {
                        images: true,
                        category: true,
                        seller: { select: { id: true, name: true } },
                    },
                },
            },
        })
        return user ? user.wishlist : null
    }

    addOne = async (user_id, listing_id) => {
        return await prisma.user.update({
            where: { id: user_id },
            data: { wishlist: { connect: { id: listing_id } } },
        })
    }

    removeOne = async (user_id, listing_id) => {
        return await prisma.user.update({
            where: { id: user_id },
            data: { wishlist: { disconnect: { id: listing_id } } },
        })
    }

}

export const wishlistService = new WishlistService();
