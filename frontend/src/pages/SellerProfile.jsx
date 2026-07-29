import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTag, FaUser, FaStar, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa'

const API_BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}`

// TODO: replace with real logged in user ID from auth context later
const CURRENT_USER_ID = 'cmr2ep0vr0003xprwfbwag2x7'

export default function SellerProfile() {
  const navigate = useNavigate()
  const [seller, setSeller] = useState(null)
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true)
        setError(null)

        const [userRes, listingsRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/${CURRENT_USER_ID}`),
          fetch(`${API_BASE}/api/listing/seller/${CURRENT_USER_ID}`)
        ])

        if (!userRes.ok) throw new Error('Could not load user profile')
        if (!listingsRes.ok) throw new Error('Could not load listings')

        const userData = await userRes.json()
        const listingsData = await listingsRes.json()

        setSeller(userData)
        setListings(listingsData)
      } catch (err) {
        console.error('Failed to load profile:', err)
        setError('Could not load profile. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#aaaaaa' }}>Loading profile...</p>
      </div>
    )
  }

  if (error || !seller) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#ff7777' }}>{error || 'Profile not found.'}</p>
        <button onClick={() => navigate('/listings')} style={secondaryButtonStyle}>← Back to Listings</button>
      </div>
    )
  }

  const activeListings = listings.filter(l => l.status === 'ACTIVE')
  const soldListings = listings.filter(l => l.status !== 'ACTIVE')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>

      {/* Left panel — seller info */}
      <div style={{
        width: '300px',
        backgroundColor: '#2a2a2a',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRight: '1px solid #333'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag style={{ fontSize: '24px', color: 'rgba(204,0,0,0.5)' }} />
          <span style={{ color: '#CC0000', fontSize: '24px', fontWeight: 'bold' }}>
            YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
          </span>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px 0' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaUser style={{ color: 'white', fontSize: '36px' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 4px' }}>{seller.name}</p>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{seller.email}</p>
          </div>

          {/* Rating placeholder — connect to ratings API later */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaStar style={{ color: '#f5a623', fontSize: '16px' }} />
            <span style={{ color: '#aaaaaa', fontSize: '13px' }}>No ratings yet</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Active Listings</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{activeListings.length}</span>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Items Sold</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{soldListings.length}</span>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Member Since</span>
            <span style={{ color: 'white', fontWeight: '600' }}>
              {seller.createdAt
                ? new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : 'N/A'}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          style={secondaryButtonStyle}
        >
          ← Back
        </button>

      </div>

      {/* Right panel — listings */}
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Header row with Sell Item button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>My Listings</h1>
          <button
            onClick={() => navigate('/sell')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#CC0000',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            + Sell Item
          </button>
        </div>

        {listings.length === 0 && (
          <p style={{ color: '#666', fontSize: '14px' }}>No listings yet.</p>
        )}

        {/* Active listings */}
        {activeListings.length > 0 && (
          <div>
            <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
              Active ({activeListings.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

        {/* Sold listings */}
        {soldListings.length > 0 && (
          <div>
            <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
              Sold ({soldListings.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {soldListings.map(listing => (
                <ListingCard key={listing.id} listing={listing} navigate={navigate} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function ListingCard({ listing, navigate }) {
  const condition = listing.condition || 'Unspecified'

  return (
    <div style={{
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: listing.status !== 'ACTIVE' ? 0.6 : 1,
      cursor: 'pointer',
    }}
      onClick={() => navigate(`/listings/${listing.id}`)}
    >

      {/* Left side info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>{listing.title}</p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {listing.category && (
            <span style={tagStyle}>{listing.category.name}</span>
          )}
          {listing.proximity && (
            <span style={{ ...tagStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaMapMarkerAlt style={{ fontSize: '11px' }} />
              {listing.proximity}
            </span>
          )}
          <span style={{
            ...tagStyle,
            backgroundColor:
              ['like new', 'excellent'].includes(condition.toLowerCase())
                ? 'rgba(34, 197, 94, 0.15)'
                : ['good', 'fair'].includes(condition.toLowerCase())
                ? 'rgba(234, 179, 8, 0.15)'
                : 'rgba(204, 0, 0, 0.15)',
            color:
              ['like new', 'excellent'].includes(condition.toLowerCase())
                ? '#22c55e'
                : ['good', 'fair'].includes(condition.toLowerCase())
                ? '#eab308'
                : '#CC0000',
          }}>
            {condition}
          </span>
        </div>

        <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
          Posted {new Date(listing.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Right side price + actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}
        onClick={e => e.stopPropagation()}
      >
        <p style={{ color: '#CC0000', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>${listing.price}</p>

        {listing.status === 'ACTIVE' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => console.log('Edit listing — connect to backend later')}
              style={{
                padding: '8px 14px',
                backgroundColor: 'transparent',
                color: '#aaaaaa',
                border: '1px solid #444',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaEdit /> Edit
            </button>
            <button
              onClick={() => console.log('Delete listing — connect to backend later')}
              style={{
                padding: '8px 14px',
                backgroundColor: 'rgba(204, 0, 0, 0.15)',
                color: '#CC0000',
                border: '1px solid rgba(204, 0, 0, 0.4)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}

        {listing.status !== 'ACTIVE' && (
          <span style={{
            backgroundColor: 'rgba(204, 0, 0, 0.15)',
            color: '#CC0000',
            border: '1px solid rgba(204, 0, 0, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
          }}>
            Sold
          </span>
        )}
      </div>

    </div>
  )
}

const tagStyle = {
  backgroundColor: '#3a3a3a',
  color: '#aaaaaa',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '13px',
}

const secondaryButtonStyle = {
  padding: '14px',
  backgroundColor: 'transparent',
  color: '#aaaaaa',
  border: '1px solid #444',
  borderRadius: '12px',
  fontSize: '15px',
  cursor: 'pointer',
  marginTop: 'auto',
}