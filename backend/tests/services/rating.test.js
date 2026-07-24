import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('Rating - Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/rating/listing/:id', () => {
        test('should return 200 and the rating corresponding to the listingId', async () => {
            prismaMock.rating.findUnique.mockResolvedValue({
                id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 500, subjectId:501
            })

            const response = await request(app)
                .get('/api/rating/listing/1')
                .expect(200)
            
            expect(response.body).toEqual({
                id: 1, score: 5, comment: "A great laptop!", listingId: 25, authorId: 500, subjectId:501
            })
        })

        test('should return an empty dictionary if listingId does not exist', async () => {
            prismaMock.rating.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/rating/listing/1')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/rating/author/:id', () => {
        test('should return 200 and the listing corresponding to authorId', async () => {
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

        test('should return an empty dictionary if authorId does not exist', async () => {
            prismaMock.rating.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/rating/author/500')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/rating/subject/:id', () => {
        test('should return 200 and the listing corresponding to subjectId', async () => {
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

        test('should return an empty dictionary if subjectId does not exist', async () => {
            prismaMock.rating.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/rating/subject/500')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('POST /api/rating/', () => {
        test('should return 200 and create rating', async () => {
            prismaMock.rating.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data
            }))

            const response = await request(app)
                .post('/api/rating/')
                .send({
                    score: 3, 
                    comment: "Ripped T-shirt", 
                    listingId: 26, 
                    authorId: 502, 
                    subjectId: 500
                })
                .expect(200)

            expect(response.body).toEqual({id: '1', score: 3, comment: "Ripped T-shirt", listingId: 26, authorId: 502, subjectId: 500})
        })
    })
})