import { listingService } from "./ListingService.js";

export class ListingController {
    getAll = async (req, res, next) => {
        try {
            const search = typeof req.query.search === 'string' ? req.query.search.trim() : ''
            const category = typeof req.query.category === 'string' ? req.query.category.trim() : ''
            const listings = await listingService.getAll({ search, category });
            res.status(200).send(listings)
        }
        catch (error) { 
            next(error);
        }
    }

    getOne = async (_req, res, next) => {
        try {
            const listing_id = _req.params.id

            if (!listing_id || !listing_id.trim()) {
                return res.status(400).json({ error: 'A valid listing ID is required' })
            }

            const listing = await listingService.getOne(listing_id)
            if (!listing) {
                return res.status(404).json({ error: 'Listing not found' })
            }
            res.status(200).send(listing)
        }
        catch (error) {
            next(error);
        }
    }

    getByCategory = async (_req, res, next) => {
        try {
            const category_id = _req.params.id
            const listings = await listingService.getByCategory(category_id)
            res.status(200).send(listings)
        }
        catch (error) {
            next(error)
        }
    }

    getBySeller = async (_req, res, next) => {
        try {
            const seller_id = _req.params.id
            const listings = await listingService.getByCategory(seller_id)
            res.status(200).send(listings)
        }
        catch (error) {
            next(error)
        }
    }

    createOne = async (_req, res, next) => {
        try {
            const {title, description = "", price, proximity, sellerId, categoryId} = _req.body
            const payload = {title, description, price, proximity, sellerId, categoryId}
            const serviceResponse = await listingService.createOne(payload)
            res.status(200).send(serviceResponse)
        }
        catch (error) {
            next(error);
        }
    }
    
    deleteOne = async (_req, res, next) => {
        try {
            const listing_id = _req.body.id
            const serivceResponse = await listingService.deleteOne(listing_id)
            res.status(200).send(serviceResponse)
        }
        catch (error) {
            next(error);
        }
    }

    purchase = async (_req, res, next) => {
        try {
            const listing_id = _req.params.id

            if (!listing_id || !listing_id.trim()) {
                return res.status(400).json({ error: 'A valid listing ID is required' })
            }

            const listing = await listingService.getOne(listing_id)
            if (!listing) {
                return res.status(404).json({ error: 'Listing not found' })
            }
            if (listing.status !== 'ACTIVE') {
                return res.status(400).json({ error: 'This listing is no longer available' })
            }

            const serviceResponse = await listingService.purchase(listing_id)
            res.status(200).send(serviceResponse)
        }
        catch (error) {
            next(error)
        }
    }
}

export const listingController = new ListingController()
