import { ratingService } from "./RatingService.js"
import { userService } from "../user/UserService.js"
import { listingService } from "../listing/ListingService.js"

export class RatingController {

    buildSummary = async (listingId, authorEmail) => {
        const ratings = await ratingService.getByListing(listingId)
        const count = ratings.length
        const average = count > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / count : null

        let userRating = null
        if (authorEmail) {
            const author = await userService.findByEmail(authorEmail)
            if (author) {
                userRating = ratings.find(r => r.authorId === author.id) || null
            }
        }

        return { average, count, userRating, ratings }
    }

    getByListing = async (_req, res, next) => {
        try {
            const listing_id = _req.params.id
            const authorEmail = _req.query.authorEmail
            const summary = await this.buildSummary(listing_id, authorEmail)
            res.status(200).send(summary)
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
            const { score, comment, listingId, authorEmail } = _req.body

            const author = await userService.findByEmail(authorEmail)
            if (!author) return res.status(404).send({ message: 'User not found' })

            const listing = await listingService.getOne(listingId)
            if (!listing) return res.status(404).send({ message: 'Listing not found' })

            const existingRatings = await ratingService.getByListing(listingId)
            const alreadyRated = existingRatings.find(r => r.authorId === author.id)

            if (alreadyRated) {
                await ratingService.updateOne(alreadyRated.id, { score, comment })
            } else {
                await ratingService.createOne({
                    score,
                    comment,
                    listingId,
                    authorId: author.id,
                    subjectId: listing.sellerId,
                })
            }

            const summary = await this.buildSummary(listingId, authorEmail)
            res.status(200).send({ summary })
        }
        catch (error) {
            next(error)
        }
    }
}

export const ratingController = new RatingController()