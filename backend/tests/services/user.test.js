import { jest } from '@jest/globals'
import { UserService } from '../../src/api/user/UserService.js'
import { prismaMock } from '../singleton.js'

describe('User Service', () => {
    let userService

    beforeEach(() => {
        jest.clearAllMocks()
        userService = new UserService()
    })

    describe('getAll', () => {
        test('should return nothing with an empty table', async () => {
            prismaMock.user.findMany.mockResolvedValue([])
            const users = await userService.getAll()

            expect(users).toHaveLength(0)
            expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1)
        })
    })
})