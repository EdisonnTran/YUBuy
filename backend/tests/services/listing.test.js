import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('Listing - Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/listing/', () => {
        test('should return 200 and every listing', async () => {
            prismaMock.listing.findMany.mockResolvedValue([
                {id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000},
                {id: 2, title: "T-Shirt", description: "A slightly used T-shirt", price: 7.50, sellerId: 501, categoryId: 1001}
            ])

            const response = await request(app)
                .get('/api/listing/')
                .expect(200)
            
            expect(response.body).toEqual([
                {id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000},
                {id: 2, title: "T-Shirt", description: "A slightly used T-shirt", price: 7.50, sellerId: 501, categoryId: 1001}
            ])
        })

        test('should return an empty dictionary if no listings exist', async () => {
            prismaMock.listing.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/listing/')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/listing/:id', () => {
        test('should return 200 and the listing corresponding to id', async () => {
            prismaMock.listing.findUnique.mockResolvedValue({
                id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000
            })

            const response = await request(app)
                .get('/api/listing/1')
                .expect(200)
            
            expect(response.body).toEqual({
                id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000
            })
        })

        test('should return an empty dictionary if listing id does not exist', async () => {
            prismaMock.listing.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/listing/1')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/listing/category/:id', () => {
        test('should return 200 and the listing corresponding to its categoryId', async () => {
            prismaMock.listing.findMany.mockResolvedValue([
                {id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000},
                {id: 2, title: "T-Shirt", description: "A slightly used T-shirt", price: 7.50, sellerId: 501, categoryId: 1000}
            ])

            const response = await request(app)
                .get('/api/listing/category/1000')
                .expect(200)
            
            expect(response.body).toEqual([
                {id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000},
                {id: 2, title: "T-Shirt", description: "A slightly used T-shirt", price: 7.50, sellerId: 501, categoryId: 1000}
            ])
        })

        test('should return an empty dictionary if categoryId does not exist', async () => {
            prismaMock.listing.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/listing/category/1000')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/listing/seller/:id', () => {
        test('should return 200 and the listing corresponding to its sellerId', async () => {
            prismaMock.listing.findMany.mockResolvedValue([
                {id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000},
                {id: 2, title: "T-Shirt", description: "A slightly used T-shirt", price: 7.50, sellerId: 500, categoryId: 1001}
            ])

            const response = await request(app)
                .get('/api/listing/seller/500')
                .expect(200)
            
            expect(response.body).toEqual([
                {id: 1, title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000},
                {id: 2, title: "T-Shirt", description: "A slightly used T-shirt", price: 7.50, sellerId: 500, categoryId: 1001}
            ])
        })

        test('should return an empty dictionary if sellerId does not exist', async () => {
            prismaMock.listing.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/listing/seller/1000')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('POST /api/listing/', () => {
        test('should return 200 and create listing', async () => {
            prismaMock.listing.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data
            }))

            const response = await request(app)
                .post('/api/listing/')
                .send({title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000})
                .expect(200)

            expect(response.body).toEqual({id: '1', title: "Test Laptop", description: "A test laptop for sale", price: 100.20, sellerId:500, categoryId:1000})
        })
    })
})