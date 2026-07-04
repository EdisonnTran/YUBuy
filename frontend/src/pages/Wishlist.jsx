import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaBook,
  FaChair,
  FaHeart,
  FaLaptop,
  FaTag,
  FaTimes,
  FaUserCircle,
} from 'react-icons/fa'

// TODO: replace with the real logged-in user's id once auth is wired up.
// This is Alice's id from the seed data, used for local testing.
const CURRENT_USER_ID = 'cmr2ep0vr0003xprwfbwag2x7'

const API_BASE = 'http://localhost:3000'

const categoryIcons = {
  Textbooks: FaBook,
  Electronics: FaLaptop,
  Furniture: FaChair,
}

export default function Wishlist() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [removingId, setRemovingId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchWishlist()
  }, [])

  async function fetchWishlist() {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE}/api/wishlist/${CURRENT_USER_ID}`)

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      setItems(data)
    } catch (err) {
      setError('Could not load your wishlist. Is the backend server running?')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(listingId) {
    setRemovingId(listingId)

    try {
      const response = await fetch(`${API_BASE}/api/wishlist`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: CURRENT_USER_ID, listingId }),
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      setItems((prev) => prev.filter((item) => item.id !== listingId))
    } catch (err) {
      setError('Could not remove that item. Please try again.')
    } finally {
      setRemovingId(null)
    }
  }

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
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/listings')}
        >
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
          <span
            style={{ color: '#aaaaaa', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => navigate('/listings')}
          >
            Browse
          </span>
          <span style={{ color: '#CC0000', fontWeight: 700 }}>Wishlist</span>
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
        <FaHeart
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
          Your Wishlist
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '17px' }}>
          Items you have saved for later.
        </p>
      </section>

      <main style={{ padding: '38px 48px 60px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h2
            style={{
              color: 'white',
              fontSize: '26px',
              fontWeight: 700,
              margin: '0 0 5px',
            }}
          >
            Saved items
          </h2>
          <p style={{ color: '#aaaaaa', fontSize: '15px' }}>
            {loading
              ? 'Loading...'
              : `${items.length} ${items.length === 1 ? 'item' : 'items'} saved`}
          </p>
        </div>

        {error && (
          <div
            style={{
              padding: '16px 20px',
              marginBottom: '24px',
              border: '1px solid #CC0000',
              borderRadius: '10px',
              backgroundColor: 'rgba(204,0,0,0.12)',
              color: '#ff7777',
              fontSize: '14px',
            }}
          >
            {error}
          </div>
        )}

        {loading ? (
          <div
            style={{
              padding: '60px 24px',
              border: '1px dashed #555555',
              borderRadius: '14px',
              color: '#aaaaaa',
              textAlign: 'center',
            }}
          >
            Loading your wishlist...
          </div>
        ) : items.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(245px, 1fr))',
              gap: '20px',
            }}
          >
            {items.map((item) => {
              const CategoryIcon = categoryIcons[item.category?.name] || FaTag
              const imageUrl = item.images?.[0]?.url

              return (
                <article
                  key={item.id}
                  style={{
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid #454545',
                    borderRadius: '14px',
                    backgroundColor: '#333333',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    disabled={removingId === item.id}
                    title="Remove from wishlist"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      zIndex: 1,
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: 0,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.55)',
                      color: removingId === item.id ? '#777777' : 'white',
                      cursor: removingId === item.id ? 'default' : 'pointer',
                    }}
                  >
                    <FaTimes />
                  </button>

                  <div
                    style={{
                      height: '155px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#a4a4a4',
                    }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <CategoryIcon
                        style={{ fontSize: '58px', color: 'rgba(255,255,255,0.7)' }}
                      />
                    )}
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
                      {item.category?.name}
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
                      {item.title}
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
                        ${item.price}
                      </strong>
                      <span style={{ color: '#aaaaaa', fontSize: '13px' }}>
                        {item.seller?.name}
                      </span>
                    </div>
                    <p
                      style={{
                        color: '#aaaaaa',
                        fontSize: '13px',
                        marginTop: '13px',
                      }}
                    >
                      {item.proximity}
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
            Your wishlist is empty. Browse listings and save something you like.
          </div>
        )}
      </main>
    </div>
  )
}
