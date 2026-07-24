import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('Message - Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/message/:id', () => {
        test('should return 200 and the message corresponding to id', async () => {
            prismaMock.message.findUnique.mockResolvedValue({
                id: 1, content: "Hello, is this available?", listingId: 25, senderId: 500, receiverId:501
            })

            const response = await request(app)
                .get('/api/message/1')
                .expect(200)
            
            expect(response.body).toEqual({
                id: 1, content: "Hello, is this available?", listingId: 25, senderId: 500, receiverId:501
            })
        })

        test('should return an empty dictionary if id does not exist', async () => {
            prismaMock.message.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/message/1')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/message/listing/:id', () => {
        test('should return 200 and the messages corresponding to listingId', async () => {
            prismaMock.message.findMany.mockResolvedValue([
               {id: 1, content: "Hello, is this available?", listingId: 25, senderId: 500, receiverId:501},
               {id: 2, content: "Yes, this is still available, when would you like to pick it up?", listingId: 25, senderId: 501, receiverId: 500}
            ])

            const response = await request(app)
                .get('/api/message/listing/25')
                .expect(200)
            
            expect(response.body).toEqual([
               {id: 1, content: "Hello, is this available?", listingId: 25, senderId: 500, receiverId:501},
               {id: 2, content: "Yes, this is still available, when would you like to pick it up?", listingId: 25, senderId: 501, receiverId: 500}
            ])
        })
    })

    test('should return an empty dictionary if there are no messages for a listing', async () => {
        prismaMock.message.findMany.mockResolvedValue(null)

        const response = await request(app)
            .get('/api/message/listing/25')
            .expect(200)
        expect(response.body).toEqual({})

    })

    describe('POST /api/message/', () => {
        test('should return 200 and create message', async () => {
            prismaMock.message.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data
            }))

            const response = await request(app)
                .post('/api/message/')
                .send({
                    content: "Hello, is this available?", listingId: 25, senderId: 500, receiverId:501
                })
                .expect(200)

            expect(response.body).toEqual({id: '1', content: "Hello, is this available?", listingId: 25, senderId: 500, receiverId:501})
        })
    })
})