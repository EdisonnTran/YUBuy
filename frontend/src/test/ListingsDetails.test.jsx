import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ListingDetail from '../pages/ListingDetails'

const mockListing = {
  id: '1',
  title: 'Introduction to Psychology',
  price: 45,
  status: 'ACTIVE',
  description: 'Great introductory psychology textbook.',
  createdAt: '2026-06-24T00:00:00.000Z',
  images: [],
  proximity: 'Keele Campus',
  condition: 'Like New',
  category: { name: 'Textbooks' },
  seller: { id: 'seller1', name: 'Jane D.', email: 'jane@yorku.ca' },
}

const mockRating = {
  average: 4.3,
  count: 12,
  userRating: null,
}

beforeEach(() => {
  cleanup()
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes('/api/listing/') || url.includes('/api/listings/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockListing),
      })
    }
    if (url.includes('/api/rating/') || url.includes('/api/ratings/')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockRating),
      })
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  }))
})

const renderWithRoute = (id = '1') => {
  render(
    <MemoryRouter initialEntries={[`/listings/${id}`]}>
      <Routes>
        <Route path="/listings/:id" element={<ListingDetail />} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ListingDetail page', () => {
  test('renders loading state initially', () => {
    renderWithRoute('1')
    expect(screen.getByText(/Loading listing/i)).toBeInTheDocument()
  })

  test('renders listing title after loading', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Introduction to Psychology')).toBeInTheDocument())
  })

  test('renders listing price after loading', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('$45')).toBeInTheDocument())
  })

  test('renders Available status badge', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Available')).toBeInTheDocument())
  })

  test('renders category tag', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Textbooks')).toBeInTheDocument())
  })

  test('renders proximity tag', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Keele Campus')).toBeInTheDocument())
  })

  test('renders description', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText(/Great introductory psychology textbook/i)).toBeInTheDocument())
  })

  test('renders seller name', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Jane D.')).toBeInTheDocument())
  })

  test('renders seller email', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('jane@yorku.ca')).toBeInTheDocument())
  })

  test('renders Message Seller button', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Message Seller')).toBeInTheDocument())
  })

  test('renders Back to Listings button', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText(/Back to Listings/i)).toBeInTheDocument())
  })

  test('renders Rate this listing section', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Rate this listing')).toBeInTheDocument())
  })

  test('renders star rating buttons', async () => {
    renderWithRoute('1')
    await waitFor(() => {
      expect(screen.getByLabelText('1 star rating')).toBeInTheDocument()
      expect(screen.getByLabelText('5 star rating')).toBeInTheDocument()
    })
  })

  test('renders Submit Rating button', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('Submit Rating')).toBeInTheDocument())
  })

  test('renders no images placeholder when images array is empty', async () => {
    renderWithRoute('1')
    await waitFor(() => expect(screen.getByText('No images uploaded')).toBeInTheDocument())
  })
})