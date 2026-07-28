import { describe, test, expect, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SellerProfile from '../pages/SellerProfile'

beforeEach(() => {
  cleanup()
})

const renderProfile = () => {
  return render(
    <MemoryRouter>
      <SellerProfile />
    </MemoryRouter>
  )
}

describe('SellerProfile page', () => {
  test('renders YUBuy header', () => {
    renderProfile()
    expect(screen.getAllByText('Buy')[0]).toBeInTheDocument()
  })

  test('renders seller name', () => {
    renderProfile()
    expect(screen.getAllByText('Jane D.')[0]).toBeInTheDocument()
  })

  test('renders seller email', () => {
    renderProfile()
    expect(screen.getAllByText('jane.d@yorku.ca')[0]).toBeInTheDocument()
  })

  test('renders seller rating', () => {
    renderProfile()
    expect(screen.getAllByText('4.3')[0]).toBeInTheDocument()
  })

  test('renders My Listings heading', () => {
    renderProfile()
    expect(screen.getAllByText('My Listings')[0]).toBeInTheDocument()
  })

  test('renders Active listings section', () => {
    renderProfile()
    expect(screen.getAllByText(/Active/i)[0]).toBeInTheDocument()
  })

  test('renders Sold listings section', () => {
    renderProfile()
    expect(screen.getAllByText(/Sold/i)[0]).toBeInTheDocument()
  })

  test('renders active listing title', () => {
    renderProfile()
    expect(screen.getAllByText('Calculus Textbook – 10th Edition')[0]).toBeInTheDocument()
  })

  test('renders sold listing title', () => {
    renderProfile()
    expect(screen.getAllByText('Scientific Calculator')[0]).toBeInTheDocument()
  })

  test('renders Edit button for active listing', () => {
    renderProfile()
    expect(screen.getAllByText(/Edit/i).length).toBeGreaterThan(0)
  })

  test('renders Delete button for active listing', () => {
    renderProfile()
    expect(screen.getAllByText(/Delete/i).length).toBeGreaterThan(0)
  })

  test('renders member since info', () => {
    renderProfile()
    expect(screen.getAllByText('September 2024')[0]).toBeInTheDocument()
  })

  test('renders active listings count', () => {
    renderProfile()
    expect(screen.getAllByText('2')[0]).toBeInTheDocument()
  })

  test('renders Back button', () => {
    renderProfile()
    expect(screen.getAllByText('← Back')[0]).toBeInTheDocument()
  })

  test('renders items sold count', () => {
    renderProfile()
    expect(screen.getAllByText('1')[0]).toBeInTheDocument()
  })
})