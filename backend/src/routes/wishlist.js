// Wishlist routes — save / view / unsave listings for a user.
// NOTE: userId is passed in for now. Once auth is wired up, it will come
// from the logged-in user's token instead of the request body/params.
import express from 'express'
import prisma from '../db/db.js'

const router = express.Router()

// GET /api/wishlist/:userId  -> list the listings a user has saved
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wishlist: {
          include: {
            images: true,
            category: true,
            seller: { select: { id: true, name: true } },
          },
        },
      },
    })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user.wishlist)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// POST /api/wishlist  body: { userId, listingId }  -> save a listing
router.post('/', async (req, res) => {
  try {
    const { userId, listingId } = req.body
    if (!userId || !listingId) {
      return res.status(400).json({ error: 'userId and listingId are required' })
    }
    await prisma.user.update({
      where: { id: userId },
      data: { wishlist: { connect: { id: listingId } } },
    })
    res.status(201).json({ message: 'Added to wishlist' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// DELETE /api/wishlist  body: { userId, listingId }  -> remove a saved listing
router.delete('/', async (req, res) => {
  try {
    const { userId, listingId } = req.body
    if (!userId || !listingId) {
      return res.status(400).json({ error: 'userId and listingId are required' })
    }
    await prisma.user.update({
      where: { id: userId },
      data: { wishlist: { disconnect: { id: listingId } } },
    })
    res.json({ message: 'Removed from wishlist' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router
