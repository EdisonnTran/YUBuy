import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Inbox from '../pages/Inbox'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}))

// Inbox.jsx loads the current user and the full user list via native fetch
const mockMe = { id: 'me1', name: 'You', email: 'you@my.yorku.ca' }
const mockUsers = [
  mockMe,
  { id: 'jane1', name: 'Jane D.', email: 'jane.d@yorku.ca' },
]

beforeEach(() => {
  localStorage.clear()
  cleanup()
  vi.stubGlobal('fetch', vi.fn((url) => {
    if (url.includes('/api/user/me')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockMe) })
    }
    if (url.includes('/api/chat/user/')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    }
    if (url.includes('/api/user')) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve(mockUsers) })
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
  }))
})

const renderInbox = () => {
  return render(
    <MemoryRouter>
      <Inbox />
    </MemoryRouter>
  )
}

describe('Inbox page', () => {
  test('renders YUBuy header', () => {
    renderInbox()
    expect(screen.getAllByText('Buy')[0]).toBeInTheDocument()
  })

  test('renders Inbox heading', () => {
    renderInbox()
    expect(screen.getByText('Inbox')).toBeInTheDocument()
  })

  test('renders New button', () => {
    renderInbox()
    expect(screen.getAllByText(/New/)[0]).toBeInTheDocument()
  })

  test('renders Back button', () => {
    renderInbox()
    expect(screen.getAllByText('Back')[0]).toBeInTheDocument()
  })

  test('shows empty state when no conversations', async () => {
    renderInbox()
    await waitFor(() => expect(screen.getByText('No conversations yet')).toBeInTheDocument())
  })

  test('shows no conversation selected when inbox is empty', async () => {
    renderInbox()
    await waitFor(() => expect(screen.getByText('No conversation selected')).toBeInTheDocument())
  })

  test('opens new message modal when New button clicked', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    expect(screen.getByText('New Message')).toBeInTheDocument()
  })

  test('renders Send to label in new message modal', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    expect(screen.getByText('Send to')).toBeInTheDocument()
  })

  test('renders user search input in new message modal', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    expect(screen.getByPlaceholderText('Search users...')).toBeInTheDocument()
  })

  test('renders Start Conversation button in modal', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    expect(screen.getByText('Start Conversation')).toBeInTheDocument()
  })

  test('Start Conversation button is disabled when no user selected', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    expect(screen.getByText('Start Conversation')).toBeDisabled()
  })

  test('renders user list when searching in modal', async () => {
    renderInbox()
    // Let the initial /api/user fetch resolve and populate userList first.
    await waitFor(() => expect(screen.getByText('No conversations yet')).toBeInTheDocument())
    fireEvent.click(screen.getAllByText(/New/)[0])
    const searchInput = screen.getByPlaceholderText('Search users...')
    fireEvent.focus(searchInput)
    expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument()
  })

  test('filters users when typing in search', async () => {
    renderInbox()
    await waitFor(() => expect(screen.getByText('No conversations yet')).toBeInTheDocument())
    fireEvent.click(screen.getAllByText(/New/)[0])
    const searchInput = screen.getByPlaceholderText('Search users...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'Jane' } })
    expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument()
  })

  test('shows conversation after creating one', async () => {
    localStorage.setItem(`yubuy_conversations_${mockMe.id}`, JSON.stringify([{
      chatId: 'me1_jane1_general',
      sellerName: 'Jane D.',
      listingTitle: 'New Conversation',
      lastMessage: '',
    }]))
    renderInbox()
    await waitFor(() => expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument())
  })
})
