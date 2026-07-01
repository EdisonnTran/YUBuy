// YUBuy — database seed script
// Populates sample categories, users, and listings so features have data to work with.
// Re-runnable: it clears existing rows first, then re-inserts.
// Run with:  npx tsx prisma/seed.ts

import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Prisma 7 connects through a driver adapter (not a bare `new PrismaClient()`).
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding...')

  // Clear existing data so this is safe to run repeatedly.
  // Order matters: delete children before parents to respect foreign keys.
  await prisma.rating.deleteMany()
  await prisma.message.deleteMany()
  await prisma.image.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // --- Categories ---
  const textbooks = await prisma.category.create({ data: { name: 'Textbooks' } })
  const electronics = await prisma.category.create({ data: { name: 'Electronics' } })
  const furniture = await prisma.category.create({ data: { name: 'Furniture' } })

  // --- Users ---
  // passwordHash is a placeholder here; real password hashing happens at registration.
  const alice = await prisma.user.create({
    data: { email: 'alice@my.yorku.ca', name: 'Alice Nguyen', passwordHash: 'seed-placeholder' },
  })
  const bob = await prisma.user.create({
    data: { email: 'bob@my.yorku.ca', name: 'Bob Singh', passwordHash: 'seed-placeholder' },
  })

  // --- Listings (all sold by Bob for now) ---
  const calcBook = await prisma.listing.create({
    data: {
      title: 'Calculus Textbook (8th ed.)',
      description: 'Lightly used, no markings. For MATH 1013.',
      price: 45.0,
      proximity: 'Keele Campus',
      sellerId: bob.id,
      categoryId: textbooks.id,
      images: { create: [{ url: 'https://placehold.co/400x300?text=Calculus+Book' }] },
    },
  })

  await prisma.listing.create({
    data: {
      title: 'IKEA Desk (white)',
      description: 'Sturdy, must pick up from residence.',
      price: 30.0,
      proximity: 'The Village',
      sellerId: bob.id,
      categoryId: furniture.id,
      images: { create: [{ url: 'https://placehold.co/400x300?text=Desk' }] },
    },
  })

  const monitor = await prisma.listing.create({
    data: {
      title: '24" Monitor',
      description: '1080p, HDMI + VGA inputs.',
      price: 60.0,
      proximity: 'Keele Campus',
      sellerId: bob.id,
      categoryId: electronics.id,
    },
  })

  // --- Wishlist ---
  // Alice saves two of Bob's listings. This writes to your _Wishlist join table.
  await prisma.user.update({
    where: { id: alice.id },
    data: { wishlist: { connect: [{ id: calcBook.id }, { id: monitor.id }] } },
  })

  console.log('Done: 3 categories, 2 users, 3 listings, 2 wishlist saves.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
