import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('Image - Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/image/', () => {
        test('should return 200 and every image', async () => {
            prismaMock.image.findMany.mockResolvedValue([
                {id: 1, url: "acoolImageLink.com", listingId: 25},
                {id: 2, url: "seeMyImageHere.net", listingId: 26}
            ])

            const response = await request(app)
                .get('/api/image/')
                .expect(200)
            
            expect(response.body).toEqual([
                {id: 1, url: "acoolImageLink.com", listingId: 25},
                {id: 2, url: "seeMyImageHere.net", listingId: 26}
            ])
        })

        test('should return an empty dictionary if id does not exist', async () => {
            prismaMock.image.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/image/')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/image/:id', () => {
        test('should return 200 and the image corresponding to id', async () => {
            prismaMock.image.findUnique.mockResolvedValue(
                {id: 2, url: "seeMyImageHere.net", listingId: 26}
            )

            const response = await request(app)
                .get('/api/image/2')
                .expect(200)
            
            expect(response.body).toEqual({id: 2, url: "seeMyImageHere.net", listingId: 26})
        })

        test('should return an empty dictionary if id does not exist', async () => {
            prismaMock.image.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/image/2')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })


    // describe('GET /api/image/listing/:id', () => {
    //     test('should return 200 and the images corresponding to listingId', async () => {
    //         prismaMock.image.findMany.mockResolvedValue([
    //             {id: 1, url: "acoolImageLink.com", listingId: 25},
    //             {id: 2, url: "seeMyImageHere.net", listingId: 26}
    //         ])

    //         const response = await request(app)
    //             .get('/api/image/listing/25')
    //             .expect(200)
            
    //         expect(response.body).toEqual([
    //             {id: 1, url: "acoolImageLink.com", listingId: 25},
    //             {id: 2, url: "seeMyImageHere.net", listingId: 26}
    //         ])
    //     })
    // })

    // test('should return an empty dictionary if there are no images for a listing', async () => {
    //     prismaMock.image.findMany.mockResolvedValue(null)

    //     const response = await request(app)
    //         .get('/api/image/listing/25')
    //         .expect(200)
    //     expect(response.body).toEqual({})

    // })

    describe('POST /api/image/', () => {
        test('should return 200 and create image', async () => {
            prismaMock.image.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data
            }))

            const response = await request(app)
                .post('/api/image/')
                .send({image_url: "seeMyImageHere.net", listingId: 26})
                .expect(200)

            expect(response.body).toEqual({id: '1', url: "seeMyImageHere.net", listingId: 26})
        })
    })
})