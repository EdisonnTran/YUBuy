// @vitest-environment jsdom
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Listings from '../pages/Listings'

vi.mock('../components/ListingsMap', () => ({
  default: () => <div data-testid="listings-map" />,
}))

const listings = [
  { id: 'book-1', title: 'Calculus Textbook', price: '45.00', proximity: 'Keele Campus', category: { name: 'Textbooks' } },
  { id: 'laptop-1', title: 'MacBook Air', price: '650.00', proximity: 'York Lanes', category: { name: 'Electronics' } },
]

function deferred() {
  let resolve
  const promise = new Promise((done) => { resolve = done })
  return { promise, resolve }
}

function renderListings() {
  return render(
    <MemoryRouter initialEntries={['/listings']}>
      <Routes>
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<h1>Listing details</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => vi.stubGlobal('fetch', vi.fn()))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Listings page', () => {
  it('renders the page and shows a loading state while the API request is pending', () => {
    fetch.mockReturnValue(deferred().promise)
    renderListings()
    expect(screen.getByRole('heading', { name: /find what you need/i })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(/loading listings/i)
  })

  it('retrieves and displays listings from the API', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => listings })
    renderListings()
    expect(await screen.findByText('Calculus Textbook')).toBeInTheDocument()
    expect(screen.getByText('MacBook Air')).toBeInTheDocument()
    expect(screen.getByText('2 items available')).toBeInTheDocument()
  })

  it('shows the empty state when the API returns no listings', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => [] })
    renderListings()
    expect(await screen.findByText(/no listings match your search/i)).toBeInTheDocument()
  })

  it('shows an error when the API request fails', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 })
    renderListings()
    expect(await screen.findByRole('alert')).toHaveTextContent(/could not load listings/i)
  })

  it('navigates to the selected listing', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => listings })
    const user = userEvent.setup()
    renderListings()
    await user.click(await screen.findByRole('link', { name: /view calculus textbook/i }))
    expect(screen.getByRole('heading', { name: /listing details/i })).toBeInTheDocument()
  })

  it('searches listings and filters them by category', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => listings })
    const user = userEvent.setup()
    renderListings()
    await screen.findByText('Calculus Textbook')

    await user.type(screen.getByRole('searchbox'), 'MacBook')
    expect(screen.queryByText('Calculus Textbook')).not.toBeInTheDocument()
    expect(screen.getByText('MacBook Air')).toBeInTheDocument()

    await user.clear(screen.getByRole('searchbox'))
    await user.click(screen.getByRole('button', { name: 'Textbooks' }))
    await waitFor(() => expect(screen.queryByText('MacBook Air')).not.toBeInTheDocument())
    expect(within(screen.getByRole('link', { name: /view calculus textbook/i })).getByText('Calculus Textbook')).toBeInTheDocument()
  })
})
