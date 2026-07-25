import { jest } from '@jest/globals'
import { WishlistService } from '../../src/api/wishlist/WishlistService.js'
import { prismaMock } from '../singleton.js'

describe('Wishlist Service', () => {
    let wishlistService

    beforeEach(() => {
        jest.clearAllMocks()
        wishlistService = new WishlistService()
    })

    describe('getAllForUser', () => {
        test('should return the listings a user has saved', async () => {
            prismaMock.user.findUnique.mockResolvedValue({
                id: 'user-1',
                wishlist: [
                    { id: 'listing-1', title: 'Calculus Textbook' },
                    { id: 'listing-2', title: 'Desk Lamp' },
                ],
            })

            const wishlist = await wishlistService.getAllForUser('user-1')

            expect(wishlist).toHaveLength(2)
            expect(prismaMock.user.findUnique).toHaveBeenCalledTimes(1)
        })

        test('should return an empty list when the user has saved nothing', async () => {
            prismaMock.user.findUnique.mockResolvedValue({ id: 'user-1', wishlist: [] })

            const wishlist = await wishlistService.getAllForUser('user-1')

            expect(wishlist).toHaveLength(0)
        })

        test('should return null when the user does not exist', async () => {
            prismaMock.user.findUnique.mockResolvedValue(null)

            const wishlist = await wishlistService.getAllForUser('does-not-exist')

            expect(wishlist).toBeNull()
        })
    })

    describe('addOne', () => {
        test('should connect the listing to the user wishlist', async () => {
            prismaMock.user.update.mockResolvedValue({ id: 'user-1' })

            await wishlistService.addOne('user-1', 'listing-1')

            expect(prismaMock.user.update).toHaveBeenCalledTimes(1)
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                data: { wishlist: { connect: { id: 'listing-1' } } },
            })
        })
    })

    describe('removeOne', () => {
        test('should disconnect the listing from the user wishlist', async () => {
            prismaMock.user.update.mockResolvedValue({ id: 'user-1' })

            await wishlistService.removeOne('user-1', 'listing-1')

            expect(prismaMock.user.update).toHaveBeenCalledTimes(1)
            expect(prismaMock.user.update).toHaveBeenCalledWith({
                where: { id: 'user-1' },
                data: { wishlist: { disconnect: { id: 'listing-1' } } },
            })
        })
    })
})
