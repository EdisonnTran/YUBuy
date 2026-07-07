import { ratingService } from "./RatingService.js";

export class RatingController {

    getByListing = async (_req, res, next) => {
        try {
            const listing_id = _req.params.id

            const rating = await ratingService.getByListing(listing_id)
            res.status(200).send(rating)
        }
        catch (error) {
            next(error);
        }
    }

    getByAuthor = async (_req, res, next) => {
        try {
            const author_id = _req.params.id

            const rating = await ratingService.getByAuthor(author_id)
            res.status(200).send(rating)
        }
        catch (error) {
            next(error);
        }
    }

    getBySubject = async (_req, res, next) => {
        try {
            const subject_id = _req.params.id

            const rating = await ratingService.getBySubject(subject_id)
            res.status(200).send(rating)
        }
        catch (error) {
            next(error);
        }
    }

    createRating = async (_req, res, next) => {
        try {
            const payload = {
                score: _req.body.score,
                comment: _req.body.comment,
                listingId: _req.body.listingId,
                authorId: _req.body.authorId,
                subjectId: _req.body.subjectId
            }

            const serviceResponse = await ratingService.createOne(payload)
            res.status(200).send(rating)
        }
        catch (error) {
            next(error)
        }
    }
}

export const ratingController = new RatingController()