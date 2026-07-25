import { wishlistService } from "./WishlistService.js";

export class WishlistController {

    getAllForUser = async (_req, res, next) => {
        try {
            const user_id = _req.params.userId
            const wishlist = await wishlistService.getAllForUser(user_id)

            if (!wishlist) {
                return res.status(404).send({ error: 'User not found' })
            }
            res.status(200).send(wishlist)
        }
        catch (error) {
            next(error);
        }
    }

    addOne = async (_req, res, next) => {
        try {
            const { userId, listingId } = _req.body

            if (!userId || !listingId) {
                return res.status(400).send({ error: 'userId and listingId are required' })
            }
            await wishlistService.addOne(userId, listingId)
            res.status(201).send({ message: 'Added to wishlist' })
        }
        catch (error) {
            next(error);
        }
    }

    removeOne = async (_req, res, next) => {
        try {
            const { userId, listingId } = _req.body

            if (!userId || !listingId) {
                return res.status(400).send({ error: 'userId and listingId are required' })
            }
            await wishlistService.removeOne(userId, listingId)
            res.status(200).send({ message: 'Removed from wishlist' })
        }
        catch (error) {
            next(error);
        }
    }

}

export const wishlistController = new WishlistController()
