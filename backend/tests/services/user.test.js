import { jest, test } from '@jest/globals'
import { UserService } from '../../src/api/user/UserService.js'
import { prismaMock } from '../singleton.js'
import app from '../../src/app.js'
import request from 'supertest'

describe('User Service - Unit Tests', () => {
    let userService

    beforeEach(() => {
        jest.clearAllMocks()
        userService = new UserService()
    })

    describe('UserService.getAll()', () => {
        test('should return nothing with an empty table', async () => {
            prismaMock.user.findMany.mockResolvedValue([])
            const users = await userService.getAll()

            expect(users).toHaveLength(0)
            expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1)
        })

        test('should return details of every user', async () => {
            prismaMock.user.findMany.mockResolvedValue([{id: 1, email: "test@test.com", passwordHash: "$!A582@#", name: "john", role: "USER"}])

            const users = await userService.getAll()
            expect(users).toHaveLength(1)
            expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1)
        })
    })
})

describe('User - Integration Tests', () => {
    let userService

    beforeEach(() => {
        jest.clearAllMocks()
        userService = new UserService()
    })

    describe('GET /api/user/', () => {
        test('should return 201 and no users if database is empty', async () => {
            prismaMock.user.findMany.mockResolvedValue([])

            const response = await request(app)
                .get('/api/user/')
                .expect('Content-Type', /json/)
                .expect(201)

            expect(response.body).toEqual([])
        })

        test('should return 200 and all users in database', async () => {
            prismaMock.user.findMany.mockResolvedValue([
                {id: 1, email: "test@test.com", passwordHash: "$!A582@#", name: "john", role: "USER"},
                {id: 2, email: "alice@gmail.com", passwordHash: "AK2J2o1$@K>,a", name: "alice", role: "ADMIN"}
            ])

            const response = await request(app)
                .get('/api/user/')
                .expect('Content-Type', /json/)
                .expect(200)

            expect(response.body).toHaveLength(2)
        })
    })

    describe('GET /api/user/:id', () => {
        test('should return 201 and not users if id is not in the database', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .get('/api/user/3')
                .expect(201)

            expect(response.body).toEqual({})
        })

        test('should return 200 and the user corresponding to the id', async () => {
            prismaMock.user.findUnique.mockResolvedValue(
                {id: 2, email: "alice@gmail.com", passwordHash: "AK2J2o1$@K>,a", name: "alice", role: "ADMIN"}
            )

            const response = await request(app)
                .get('/api/user/2')
                .expect(200)

            expect(response.body).toEqual({id: 2, email: "alice@gmail.com", passwordHash: "AK2J2o1$@K>,a", name: "alice", role: "ADMIN"})
        })
    })

    describe('POST /api/user', () => {
        test('should return 200 and create the user', async () => {
            prismaMock.user.create.mockImplementation(async ({ data }) => ({
                id: '1',
                ...data,
            }))

            const response = await request(app)
                .post('/api/user/')
                .send({
                    email: 'john@gmail.com',
                    password: 'testpassword',
                    name: 'John'
                })
                .expect(200)

            expect(response.body.id).toBe('1')
            expect(response.body.passwordHash).not.toBe('testpassword')
        })

        test('should return 500 if email is a duplicate', async () => {
            const existingUnique = []
            let id = 1
            prismaMock.user.create.mockImplementation(async ({ data }) => {
                if (existingUnique.includes(data.email)) {
                    const error = new Error('Unique constraint failed')
                    error.code = 'P2002'
                    throw error
                }
                existingUnique.push(data.email)
                id++
                return {id, ...data}
            })

            const response = await request(app)
                .post('/api/user/')
                .send({
                    email: 'john@gmail.com',
                    password: 'testpassword',
                    name: 'John'
                })
                .expect(200)

            const duplicate = await request(app)
                .post('/api/user/')
                .send({
                    email: 'john@gmail.com',
                    password: 'testpassword',
                    name: 'Johnathon'
                })
                .expect(500)
                
            expect(duplicate.body.error).toBe('Email already in use')
        })
    })
    
    describe('POST /api/user/login', () => {
        test('should return 200 on successful user login', async () => {
            prismaMock.user.create.mockImplementation(async ({data}) => ({
                id: '1',
                ...data
            }))

            const creation = await request(app)
                .post('/api/user/')
                .send({
                    email: "alice@test.com",
                    password: "test123",
                    name: "Alice"
                })

            prismaMock.user.findUnique.mockResolvedValue({
                id: 1, email: "alice@test.com", passwordHash: creation.body.passwordHash, name: "Alice", role: "USER"
            })

            const response = await request(app)
                .post('/api/user/login/')
                .send({
                    email: "alice@test.com",
                    password: "test123",
                    name: "Alice"
                })
                .expect(200)
            
            expect(response.body).toEqual({id: 1, email: "alice@test.com", passwordHash: creation.body.passwordHash, name: "Alice", role: "USER"})
        })

        test('should return 401 if user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)

            const response = await request(app)
                .post('/api/user/login/')
                .send({
                    email: "alice@test.com",
                    password: "test123",
                    name: "Alice"
                })
                .expect(401)
            
            expect(response.body.message).toBe("User does not exist")
        })

        test('should return 401 if password is incorrect', async () => {
            prismaMock.user.create.mockImplementation(async ({data}) => ({
                id: '1',
                ...data
            }))

            const creation = await request(app)
                .post('/api/user/')
                .send({
                    email: "alice@test.com",
                    password: "test123",
                    name: "Alice"
                })

            prismaMock.user.findUnique.mockResolvedValue({
                id: 1, email: "alice@test.com", passwordHash: creation.body.passwordHash, name: "Alice", role: "USER"
            })

            const response = await request(app)
                .post('/api/user/login/')
                .send({
                    email: "alice@test.com",
                    password: "wrongPassword",
                    name: "Alice"
                })
                .expect(401)
            
            expect(response.body.message).toBe("Incorrect password for user")
        })
    })

    describe('POST /api/user/logout', () => {
        test('should return 201 if user tries to logout without logging in', async () => {
            const response = await request(app)
                .post('/api/user/logout/')
                .expect(201)
            
            expect(response.body.loggedIn).toBe(false)
        })

        test('should return 200 when a logged in user logs out', async () => {
            const agent = request.agent(app)
            prismaMock.user.create.mockImplementation(async ({data}) => ({
                id: '1',
                ...data
            }))

            const creation = await agent
                .post('/api/user/')
                .send({
                    email: "alice@test.com",
                    password: "test123",
                    name: "Alice"
                })

            prismaMock.user.findUnique.mockResolvedValue({
                id: 1, email: "alice@test.com", passwordHash: creation.body.passwordHash, name: "Alice", role: "USER"
            })

            const login = await agent
                .post('/api/user/login/')
                .send({
                    email: "alice@test.com",
                    password: "test123",
                    name: "Alice"
                })
                .expect(200)

            const response = await agent
                .post('/api/user/logout/')
                .expect(200)
            
            expect(response.body.loggedIn).toBe(false)
        })
    })
})