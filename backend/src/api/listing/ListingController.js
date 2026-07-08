import { listingService } from "./ListingService.js";

export class ListingController {
    getAll = async (_req, res, next) => {
        try {
            const listings = await listingService.getAll();
            res.status(200).send(listings)
        }
        catch (error) { 
            next(error);
        }
    }

    getOne = async (_req, res, next) => {
        try {
            const listing_id = _req.params.id

            const listing = await listingService.getOne(listing_id)
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
            const serivceResponse = await listingSerivce.deleteOne(listing_id)
            res.status(200).send(serviceResponse)
        }
        catch (error) {
            next(error);
        }
    }
}

export const listingController = new ListingController()