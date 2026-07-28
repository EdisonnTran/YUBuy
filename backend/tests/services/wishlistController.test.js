import { jest } from '@jest/globals'

jest.unstable_mockModule('../../src/api/wishlist/WishlistService.js', () => ({
    wishlistService: {
        getAllForUser: jest.fn(),
        addOne: jest.fn(),
        removeOne: jest.fn(),
    },
}))

const { wishlistService } = await import('../../src/api/wishlist/WishlistService.js')
const { WishlistController } = await import('../../src/api/wishlist/WishlistController.js')

// Minimal Express response stand-in so we can assert on status/body.
function mockResponse() {
    const res = {}
    res.status = jest.fn().mockReturnValue(res)
    res.send = jest.fn().mockReturnValue(res)
    return res
}

describe('Wishlist Controller', () => {
    let controller
    let res
    let next

    beforeEach(() => {
        jest.clearAllMocks()
        controller = new WishlistController()
        res = mockResponse()
        next = jest.fn()
    })

    describe('getAllForUser', () => {
        test('should respond 200 with the wishlist when the user exists', async () => {
            const saved = [{ id: 'listing-1', title: 'Calculus Textbook' }]
            wishlistService.getAllForUser.mockResolvedValue(saved)

            await controller.getAllForUser({ params: { userId: 'user-1' } }, res, next)

            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith(saved)
            expect(next).not.toHaveBeenCalled()
        })

        test('should respond 404 when the user does not exist', async () => {
            wishlistService.getAllForUser.mockResolvedValue(null)

            await controller.getAllForUser({ params: { userId: 'nope' } }, res, next)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.send).toHaveBeenCalledWith({ error: 'User not found' })
        })

        test('should forward unexpected errors to next', async () => {
            const boom = new Error('database is down')
            wishlistService.getAllForUser.mockRejectedValue(boom)

            await controller.getAllForUser({ params: { userId: 'user-1' } }, res, next)

            expect(next).toHaveBeenCalledWith(boom)
        })
    })

    describe('addOne', () => {
        test('should respond 201 when the listing is saved', async () => {
            wishlistService.addOne.mockResolvedValue({ id: 'user-1' })

            await controller.addOne({ body: { userId: 'user-1', listingId: 'listing-1' } }, res, next)

            expect(wishlistService.addOne).toHaveBeenCalledWith('user-1', 'listing-1')
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.send).toHaveBeenCalledWith({ message: 'Added to wishlist' })
        })

        test('should respond 400 when userId is missing', async () => {
            await controller.addOne({ body: { listingId: 'listing-1' } }, res, next)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(wishlistService.addOne).not.toHaveBeenCalled()
        })

        test('should respond 400 when listingId is missing', async () => {
            await controller.addOne({ body: { userId: 'user-1' } }, res, next)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(wishlistService.addOne).not.toHaveBeenCalled()
        })
    })

    describe('removeOne', () => {
        test('should respond 200 when the listing is removed', async () => {
            wishlistService.removeOne.mockResolvedValue({ id: 'user-1' })

            await controller.removeOne({ body: { userId: 'user-1', listingId: 'listing-1' } }, res, next)

            expect(wishlistService.removeOne).toHaveBeenCalledWith('user-1', 'listing-1')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.send).toHaveBeenCalledWith({ message: 'Removed from wishlist' })
        })

        test('should respond 400 when required fields are missing', async () => {
            await controller.removeOne({ body: {} }, res, next)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(wishlistService.removeOne).not.toHaveBeenCalled()
        })
    })
})
