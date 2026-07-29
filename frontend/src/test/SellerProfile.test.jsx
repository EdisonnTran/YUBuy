import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SellerProfile from '../pages/SellerProfile'

const mockUser = {
  id: 'cmr2ep0vr0003xprwfbwag2x7',
  name: 'Jane D.',
  email: 'jane.d@yorku.ca',
  createdAt: '2024-09-01T00:00:00.000Z',
  role: 'SELLER',
}

const mockListings = [
  {
    id: '1',
    title: 'Calculus Textbook – 10th Edition',
    price: 45,
    status: 'ACTIVE',
    condition: 'Like New',
    proximity: 'Keele Campus',
    createdAt: '2026-06-24T00:00:00.000Z',
    category: { name: 'Textbooks' },
  },
  {
    id: '2',
    title: 'IKEA Desk Lamp',
    price: 15,
    status: 'ACTIVE',
    condition: 'Good',
    proximity: 'Glendon Campus',
    createdAt: '2026-06-22T00:00:00.000Z',
    category: { name: 'Furniture' },
  },
  {
    id: '3',
    title: 'Scientific Calculator',
    price: 20,
    status: 'SOLD',
    condition: 'Fair',
    proximity: 'Keele Campus',
    createdAt: '2026-06-10T00:00:00.000Z',
    category: { name: 'Electronics' },
  },
]

beforeEach(() => {
  cleanup()
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes('/api/user/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUser),
      })
    }
    if (url.includes('/api/listing/seller/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockListings),
      })
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  }))
})

const renderProfile = () => {
  return render(
    <MemoryRouter>
      <SellerProfile />
    </MemoryRouter>
  )
}

describe('SellerProfile page', () => {
  test('renders loading state initially', () => {
    renderProfile()
    expect(screen.getByText('Loading profile...')).toBeInTheDocument()
  })

  test('renders YUBuy header after loading', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText('Buy')[0]).toBeInTheDocument())
  })

  test('renders seller name after loading', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getByText('Jane D.')).toBeInTheDocument())
  })

  test('renders seller email after loading', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getByText('jane.d@yorku.ca')).toBeInTheDocument())
  })

  test('renders My Listings heading', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getByText('My Listings')).toBeInTheDocument())
  })

  test('renders Active listings section', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText(/Active/i)[0]).toBeInTheDocument())
  })

  test('renders Sold listings section', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText(/Sold/i)[0]).toBeInTheDocument())
  })

  test('renders active listing title', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getByText('Calculus Textbook – 10th Edition')).toBeInTheDocument())
  })

  test('renders sold listing title', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getByText('Scientific Calculator')).toBeInTheDocument())
  })

  test('renders Edit button for active listing', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText(/Edit/i).length).toBeGreaterThan(0))
  })

  test('renders Delete button for active listing', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText(/Delete/i).length).toBeGreaterThan(0))
  })

  test('renders member since info', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getByText('September 2024')).toBeInTheDocument())
  })

  test('renders active listings count', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText('2')[0]).toBeInTheDocument())
  })

  test('renders Back button', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText('← Back')[0]).toBeInTheDocument())
  })

  test('renders items sold count', async () => {
    renderProfile()
    await waitFor(() => expect(screen.getAllByText('1')[0]).toBeInTheDocument())
  })
})