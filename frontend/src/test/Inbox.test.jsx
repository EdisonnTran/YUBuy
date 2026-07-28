import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Inbox from '../pages/Inbox'

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}))

beforeEach(() => {
  localStorage.clear()
  cleanup()
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

  test('shows empty state when no conversations', () => {
    renderInbox()
    expect(screen.getByText('No conversations yet')).toBeInTheDocument()
  })

  test('shows no conversation selected when inbox is empty', () => {
    renderInbox()
    expect(screen.getByText('No conversation selected')).toBeInTheDocument()
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

  test('renders user list when searching in modal', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    const searchInput = screen.getByPlaceholderText('Search users...')
    fireEvent.focus(searchInput)
    expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument()
  })

  test('filters users when typing in search', () => {
    renderInbox()
    fireEvent.click(screen.getAllByText(/New/)[0])
    const searchInput = screen.getByPlaceholderText('Search users...')
    fireEvent.focus(searchInput)
    fireEvent.change(searchInput, { target: { value: 'Jane' } })
    expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument()
  })

  test('shows conversation after creating one', () => {
    localStorage.setItem('yubuy_conversations', JSON.stringify([{
      chatId: 'user_johnmark_user_jane_general',
      sellerName: 'Jane D.',
      listingTitle: 'New Conversation',
      lastMessage: '',
    }]))
    renderInbox()
    expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument()
  })
})