import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

const listing = {
    id: 'listing-1',
    title: 'MacBook Air',
    description: 'Excellent condition',
    price: 650,
    category: { name: 'Electronics' }
}

describe('Listings endpoints', () => {
    beforeEach(() => jest.clearAllMocks())

    test('getListings returns all active listings', async () => {
        prismaMock.listing.findMany.mockResolvedValue([listing])
        const response = await request(app).get('/api/listing').expect(200)
        expect(response.body).toEqual([listing])
        expect(prismaMock.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: { status: 'ACTIVE' }
        }))
    })

    test('getListings forwards search and category filters to Prisma', async () => {
        prismaMock.listing.findMany.mockResolvedValue([listing])
        const response = await request(app)
            .get('/api/listing?search=macbook&category=Electronics')
            .expect(200)
        expect(response.body).toEqual([listing])
        expect(prismaMock.listing.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: {
                status: 'ACTIVE',
                OR: [
                    { title: { contains: 'macbook', mode: 'insensitive' } },
                    { description: { contains: 'macbook', mode: 'insensitive' } }
                ],
                category: { name: { equals: 'Electronics', mode: 'insensitive' } }
            }
        }))
    })

    test('getListings forwards database errors to the error handler', async () => {
        prismaMock.listing.findMany.mockRejectedValue(new Error('database unavailable'))
        const response = await request(app).get('/api/listing').expect(500)
        expect(response.body).toEqual({ error: 'Something went wrong' })
    })

    test('getListingById returns the requested listing', async () => {
        prismaMock.listing.findUnique.mockResolvedValue(listing)
        const response = await request(app).get('/api/listing/listing-1').expect(200)
        expect(response.body).toEqual(listing)
        expect(prismaMock.listing.findUnique).toHaveBeenCalledWith(expect.objectContaining({
            where: { id: 'listing-1' }
        }))
    })

    test('getListingById returns 404 when the listing does not exist', async () => {
        prismaMock.listing.findUnique.mockResolvedValue(null)
        const response = await request(app).get('/api/listing/missing').expect(404)
        expect(response.body).toEqual({ error: 'Listing not found' })
    })

    test('getListingById rejects an invalid request parameter', async () => {
        const response = await request(app).get('/api/listing/%20').expect(400)
        expect(response.body).toEqual({ error: 'A valid listing ID is required' })
        expect(prismaMock.listing.findUnique).not.toHaveBeenCalled()
    })
})
