import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBook,
  FaChair,
  FaLaptop,
  FaSearch,
  FaShoppingBag,
  FaTag,
  FaUserCircle,
} from 'react-icons/fa'

const listings = [
  {
    id: 1,
    title: 'Introduction to Psychology',
    price: 45,
    category: 'Textbooks',
    condition: 'Like new',
    location: 'Keele Campus',
    icon: FaBook,
  },
  {
    id: 2,
    title: 'MacBook Air M1',
    price: 650,
    category: 'Electronics',
    condition: 'Good',
    location: 'York Lanes',
    icon: FaLaptop,
  },
  {
    id: 3,
    title: 'Ergonomic Desk Chair',
    price: 80,
    category: 'Furniture',
    condition: 'Good',
    location: 'The Village',
    icon: FaChair,
  },
  {
    id: 4,
    title: 'Calculus: Early Transcendentals',
    price: 55,
    category: 'Textbooks',
    condition: 'Like new',
    location: 'Keele Campus',
    icon: FaBook,
  },
  {
    id: 5,
    title: 'Noise-Cancelling Headphones',
    price: 95,
    category: 'Electronics',
    condition: 'Excellent',
    location: 'Glendon Campus',
    icon: FaLaptop,
  },
  {
    id: 6,
    title: 'Compact Study Desk',
    price: 60,
    category: 'Furniture',
    condition: 'Used',
    location: 'The Village',
    icon: FaChair,
  },
]

const categories = ['All', 'Textbooks', 'Electronics', 'Furniture']

export default function Listings() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const navigate = useNavigate()

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase()

    return listings.filter((listing) => {
      const matchesCategory =
        activeCategory === 'All' || listing.category === activeCategory
      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#2a2a2a',
        color: 'white',
        textAlign: 'left',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          padding: '22px 48px',
          borderBottom: '1px solid #444444',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag style={{ fontSize: '28px', color: 'rgba(204,0,0,0.55)' }} />
          <h2
            style={{
              color: '#CC0000',
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0,
            }}
          >
            YU
            <span style={{ color: 'white', fontWeight: 400 }}>Buy</span>
          </h2>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ color: '#CC0000', fontWeight: 700 }}>Browse</span>
          <button
            type="button"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 18px',
              border: 0,
              borderRadius: '10px',
              backgroundColor: '#CC0000',
              color: 'white',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <FaTag /> Sell an item
          </button>
          <FaUserCircle
            title="Sign out"
            onClick={() => navigate('/login')}
            style={{ fontSize: '28px', color: '#aaaaaa', cursor: 'pointer' }}
          />
        </nav>
      </header>

      <section
        style={{
          backgroundColor: '#CC0000',
          padding: '54px 48px',
          textAlign: 'center',
        }}
      >
        <FaShoppingBag
          style={{
            fontSize: '46px',
            color: 'rgba(255,255,255,0.3)',
            marginBottom: '12px',
          }}
        />
        <h1
          style={{
            color: 'white',
            fontSize: '36px',
            fontWeight: 700,
            margin: '0 0 10px',
          }}
        >
          Find what you need
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px' }}>
          Buy from students across the York University community.
        </p>

        <div
          style={{
            position: 'relative',
            maxWidth: '620px',
            margin: '28px auto 0',
          }}
        >
          <FaSearch
            style={{
              position: 'absolute',
              left: '18px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
            }}
          />
          <input
            type="search"
            placeholder="Search textbooks, electronics, furniture..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              width: '100%',
              padding: '16px 18px 16px 48px',
              border: 0,
              borderRadius: '12px',
              backgroundColor: '#a4a4a4',
              color: 'white',
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
      </section>

      <main style={{ padding: '38px 48px 60px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '28px',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                color: 'white',
                fontSize: '26px',
                fontWeight: 700,
                margin: '0 0 5px',
              }}
            >
              Latest listings
            </h2>
            <p style={{ color: '#aaaaaa', fontSize: '15px' }}>
              {filteredListings.length}{' '}
              {filteredListings.length === 1 ? 'item' : 'items'} available
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {categories.map((category) => {
              const isActive = activeCategory === category

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  style={{
                    padding: '9px 14px',
                    border: isActive ? '1px solid #CC0000' : '1px solid #555555',
                    borderRadius: '999px',
                    backgroundColor: isActive ? '#CC0000' : 'transparent',
                    color: 'white',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  {category}
                </button>
              )
            })}
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
              gap: '20px',
            }}
          >
            {filteredListings.map((listing) => {
              const ListingIcon = listing.icon

              return (
                <article
                  key={listing.id}
                  onClick={() => navigate(`/listings/${listing.id}`)}
                  style={{
                    overflow: 'hidden',
                    border: '1px solid #454545',
                    borderRadius: '14px',
                    backgroundColor: '#333333',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    style={{
                      height: '155px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#a4a4a4',
                    }}
                  >
                    <ListingIcon
                      style={{ fontSize: '58px', color: 'rgba(255,255,255,0.7)' }}
                    />
                  </div>
                  <div style={{ padding: '19px' }}>
                    <span
                      style={{
                        color: '#CC0000',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {listing.category}
                    </span>
                    <h3
                      style={{
                        minHeight: '48px',
                        color: 'white',
                        fontSize: '18px',
                        lineHeight: 1.35,
                        margin: '8px 0 12px',
                      }}
                    >
                      {listing.title}
                    </h3>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <strong style={{ color: 'white', fontSize: '22px' }}>
                        ${listing.price}
                      </strong>
                        <span
                          style={{
                            padding: '5px 9px',
                            borderRadius: '6px',
                            backgroundColor:
                              ['like new', 'excellent'].includes(listing.condition.toLowerCase())
                                ? 'rgba(34, 197, 94, 0.15)'
                                : ['good', 'fair'].includes(listing.condition.toLowerCase())
                                ? 'rgba(234, 179, 8, 0.15)'
                                : 'rgba(204, 0, 0, 0.15)',
                            color:
                              ['like new', 'excellent'].includes(listing.condition.toLowerCase())
                                ? '#22c55e'
                                : ['good', 'fair'].includes(listing.condition.toLowerCase())
                                ? '#eab308'
                                : '#ff7777',
                            fontSize: '12px',
                          }}
                        >
                          {listing.condition}
                        </span>
                    </div>
                    <p
                      style={{
                        color: '#aaaaaa',
                        fontSize: '13px',
                        marginTop: '13px',
                      }}
                    >
                      {listing.location}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div
            style={{
              padding: '60px 24px',
              border: '1px dashed #555555',
              borderRadius: '14px',
              color: '#aaaaaa',
              textAlign: 'center',
            }}
          >
            No listings match your search.
          </div>
        )}
      </main>
    </div>
  )
}
