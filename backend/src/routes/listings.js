// Listings routes — browse listings from the database.
import express from 'express'
import prisma from '../db/db.js'

const router = express.Router()

// GET /api/listings  -> all active listings, newest first
router.get('/', async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      include: {
        images: true,
        category: true,
        seller: { select: { id: true, name: true } },
      },
    })
    res.json(listings)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

// GET /api/listings/:id  -> a single listing by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: true,
        category: true,
        seller: { select: { id: true, name: true } },
      },
    })
    if (!listing) return res.status(404).json({ error: 'Listing not found' })
    res.json(listing)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

export default router
