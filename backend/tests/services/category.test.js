import { jest, test } from '@jest/globals'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('category - Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('GET /api/category/', () => {
        test('should return 200 and every category', async () => {
            prismaMock.category.findMany.mockResolvedValue([
                {id: 25, name: "Technology"},
                {id: 26, name: "Clothes"}
            ])

            const response = await request(app)
                .get('/api/category/')
                .expect(200)
            
            expect(response.body).toEqual([
                {id: 25, name: "Technology"},
                {id: 26, name: "Clothes"}
            ])
        })

        test('should return an empty dictionary if id does not exist', async () => {
            prismaMock.category.findMany.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/category/')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('GET /api/category/:id', () => {
        test('should return 200 and the category corresponding to id', async () => {
            prismaMock.category.findUnique.mockResolvedValue(
                {id: 25, name: "Technology"}
            )

            const response = await request(app)
                .get('/api/category/25')
                .expect(200)
            
            expect(response.body).toEqual({id: 25, name: "Technology"})
        })

        test('should return an empty dictionary if id does not exist', async () => {
            prismaMock.category.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/category/25')
                .expect(200)
            
            expect(response.body).toEqual({})
        })
    })

    describe('POST /api/category/', () => {
        test('should return 200 and create category', async () => {
            prismaMock.category.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data
            }))

            const response = await request(app)
                .post('/api/category/')
                .send({name: "Technology"})
                .expect(200)

            expect(response.body).toEqual({id: '1', name: "Technology"})
        })
    })
})