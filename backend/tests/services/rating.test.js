import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('Rating - Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/rating/listing/:id', () => {
        test('should return 200 and a rating summary with count and average', async () => {
            prismaMock.rating.findMany.mockResolvedValue([
                { id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 500, subjectId: 501, createdAt: new Date() },
                { id: 2, score: 3, comment: "It was okay", listingId: 25, authorId: 502, subjectId: 501, createdAt: new Date() },
            ])

            const response = await request(app)
                .get('/api/rating/listing/25')
                .expect(200)

            expect(response.body.count).toBe(2)
            expect(response.body.average).toBe(4)
            expect(response.body.userRating).toBeNull()
        })

        test('should return 0 count and null average if no ratings exist', async () => {
            prismaMock.rating.findMany.mockResolvedValue([])

            const response = await request(app)
                .get('/api/rating/listing/1')
                .expect(200)

            expect(response.body).toEqual({
                average: null,
                count: 0,
                userRating: null,
                ratings: [],
            })
        })

        test('should include userRating when authorEmail matches an existing rating', async () => {
            prismaMock.rating.findMany.mockResolvedValue([
                { id: 1, score: 5, comment: "Great!", listingId: 25, authorId: 500, subjectId: 501, createdAt: new Date() },
            ])
            prismaMock.user.findUnique.mockResolvedValue({ id: 500, email: 'buyer@test.com' })

            const response = await request(app)
                .get('/api/rating/listing/25?authorEmail=buyer@test.com')
                .expect(200)

            expect(response.body.userRating.id).toBe(1)
        })
    })

    describe('GET /api/rating/author/:id', () => {
        test('should return 200 and the ratings corresponding to authorId', async () => {
            prismaMock.rating.findMany.mockResolvedValue([
                {id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 500, subjectId:501},
                {id: 2, score: 3, comment: "Ripped T-shirt", listingId: 26, authorId: 500, subjectId: 502}
            ])

            const response = await request(app)
                .get('/api/rating/author/500')
                .expect(200)

            expect(response.body).toEqual([
                {id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 500, subjectId:501},
                {id: 2, score: 3, comment: "Ripped T-shirt", listingId: 26, authorId: 500, subjectId: 502}
            ])
        })

        test('should return an empty array if authorId does not exist', async () => {
            prismaMock.rating.findMany.mockResolvedValue([])

            const response = await request(app)
                .get('/api/rating/author/500')
                .expect(200)

            expect(response.body).toEqual([])
        })
    })

    describe('GET /api/rating/subject/:id', () => {
        test('should return 200 and the ratings corresponding to subjectId', async () => {
            prismaMock.rating.findMany.mockResolvedValue([
                {id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 501, subjectId:500},
                {id: 2, score: 3, comment: "Ripped T-shirt", listingId: 26, authorId: 502, subjectId: 500}
            ])

            const response = await request(app)
                .get('/api/rating/subject/500')
                .expect(200)

            expect(response.body).toEqual([
                {id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 501, subjectId:500},
                {id: 2, score: 3, comment: "Ripped T-shirt", listingId: 26, authorId: 502, subjectId: 500}
            ])
        })

        test('should return an empty array if subjectId does not exist', async () => {
            prismaMock.rating.findMany.mockResolvedValue([])

            const response = await request(app)
                .get('/api/rating/subject/500')
                .expect(200)

            expect(response.body).toEqual([])
        })
    })

    describe('POST /api/rating/', () => {
        test('should return 200 and create a rating under the resolved author, wrapped in a summary', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 502, email: 'buyer@test.com' })
            prismaMock.listing.findUnique.mockResolvedValue({ id: 26, sellerId: 500 })
            prismaMock.rating.findMany.mockResolvedValueOnce([])
            prismaMock.rating.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data
            }))
            prismaMock.rating.findMany.mockResolvedValueOnce([
                { id: '1', score: 3, comment: 'Ripped T-shirt', listingId: 26, authorId: 502, subjectId: 500, createdAt: new Date() },
            ])

            const response = await request(app)
                .post('/api/rating/')
                .send({
                    score: 3,
                    comment: "Ripped T-shirt",
                    listingId: 26,
                    authorEmail: 'buyer@test.com',
                })
                .expect(200)

            expect(response.body.summary.count).toBe(1)
            expect(response.body.summary.average).toBe(3)
        })

        test('should return 404 if the author email does not match a real user', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .post('/api/rating/')
                .send({
                    score: 3,
                    comment: "Ripped T-shirt",
                    listingId: 26,
                    authorEmail: 'nobody@test.com',
                })
                .expect(404)

            expect(response.body.message).toBe('User not found')
        })

        test('should update an existing rating instead of creating a duplicate', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 502, email: 'buyer@test.com' })
            prismaMock.listing.findUnique.mockResolvedValue({ id: 26, sellerId: 500 })
            prismaMock.rating.findMany.mockResolvedValueOnce([
                { id: '1', score: 1, comment: 'old comment', listingId: 26, authorId: 502, subjectId: 500 },
            ])
            prismaMock.rating.update.mockResolvedValue({
                id: '1', score: 5, comment: 'updated!', listingId: 26, authorId: 502, subjectId: 500,
            })
            prismaMock.rating.findMany.mockResolvedValueOnce([
                { id: '1', score: 5, comment: 'updated!', listingId: 26, authorId: 502, subjectId: 500, createdAt: new Date() },
            ])

            const response = await request(app)
                .post('/api/rating/')
                .send({
                    score: 5,
                    comment: "updated!",
                    listingId: 26,
                    authorEmail: 'buyer@test.com',
                })
                .expect(200)

            expect(prismaMock.rating.update).toHaveBeenCalled()
            expect(prismaMock.rating.create).not.toHaveBeenCalled()
            expect(response.body.summary.average).toBe(5)
        })
    })
})