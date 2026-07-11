import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaTag, FaUser, FaStar, FaMapMarkerAlt, FaEnvelope, FaImage } from 'react-icons/fa'
import { FaBook, FaChair, FaLaptop } from 'react-icons/fa'

// Placeholder data — will be replaced with real API call later
const mockListings = [
  {
    id: 1,
    title: 'Introduction to Psychology',
    price: 45,
    category: 'Textbooks',
    proximityTag: 'Keele Campus',
    condition: 'Like New',
    status: 'available',
    postedDate: 'June 24, 2026',
    description: 'Great introductory psychology textbook. Barely used, no highlights.',
    images: [],
    seller: { name: 'Jane D.', rating: 4.3, totalRatings: 12 },
  },
  {
    id: 2,
    title: 'MacBook Air M1',
    price: 650,
    category: 'Electronics',
    proximityTag: 'York Lanes',
    condition: 'Good',
    status: 'available',
    postedDate: 'June 22, 2026',
    description: 'MacBook Air M1 in great condition. Battery health at 91%. Comes with charger.',
    images: [],
    seller: { name: 'Mark T.', rating: 4.7, totalRatings: 8 },
  },
  {
    id: 3,
    title: 'Ergonomic Desk Chair',
    price: 80,
    category: 'Furniture',
    proximityTag: 'The Village',
    condition: 'Good',
    status: 'available',
    postedDate: 'June 20, 2026',
    description: 'Comfortable ergonomic desk chair, perfect for long study sessions.',
    images: [],
    seller: { name: 'Alex K.', rating: 4.1, totalRatings: 5 },
  },
  {
    id: 4,
    title: 'Calculus: Early Transcendentals',
    price: 55,
    category: 'Textbooks',
    proximityTag: 'Keele Campus',
    condition: 'Like New',
    status: 'available',
    postedDate: 'June 19, 2026',
    description: 'Calculus Early Transcendentals, barely used. No writing or highlights inside.',
    images: [],
    seller: { name: 'Sara M.', rating: 4.5, totalRatings: 20 },
  },
  {
    id: 5,
    title: 'Noise-Cancelling Headphones',
    price: 95,
    category: 'Electronics',
    proximityTag: 'Glendon Campus',
    condition: 'Excellent',
    status: 'available',
    postedDate: 'June 18, 2026',
    description: 'Sony noise-cancelling headphones. Perfect for studying in loud environments.',
    images: [],
    seller: { name: 'Jane D.', rating: 4.3, totalRatings: 12 },
  },
  {
    id: 6,
    title: 'Compact Study Desk',
    price: 60,
    category: 'Furniture',
    proximityTag: 'The Village',
    condition: 'Used',
    status: 'available',
    postedDate: 'June 17, 2026',
    description: 'Small compact desk, great for dorm rooms. Some minor scratches on surface.',
    images: [],
    seller: { name: 'Mark T.', rating: 4.7, totalRatings: 8 },
  },
]

export default function ListingDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const listing = mockListings.find(l => l.id === parseInt(id)) || mockListings[0]
  const [activeImg, setActiveImg] = useState(0)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>

      {/* Left panel */}
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag style={{ fontSize: '24px', color: 'rgba(204,0,0,0.5)' }} />
          <span style={{ color: '#CC0000', fontSize: '24px', fontWeight: 'bold' }}>
            YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
          </span>
        </div>

        {/* Image area */}
        <div style={{
          backgroundColor: '#2a2a2a',
          borderRadius: '12px',
          height: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px'
        }}>
          {listing.images.length > 0
            ? <img src={listing.images[activeImg]} alt="listing" style={{ maxHeight: '100%', maxWidth: '100%', borderRadius: '12px', objectFit: 'contain' }} />
            : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <FaImage style={{ fontSize: '48px', color: '#444' }} />
                <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>No images uploaded</p>
              </div>
            )
          }
        </div>

        {/* Thumbnail row */}
        {listing.images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {listing.images.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setActiveImg(i)}
                style={{
                  width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px',
                  border: i === activeImg ? '2px solid #CC0000' : '2px solid transparent',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        )}

        {/* Title, date, price and status badge */}
        <div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px' }}>
            {listing.title}
          </h1>

          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px' }}>
            Posted {listing.postedDate}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div>
              <p style={{ color: '#666', fontSize: '12px', margin: '0 0 2px', textTransform: 'uppercase', letterSpacing: '0.8px' }}>Asking Price</p>
              <p style={{ color: '#CC0000', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
                ${listing.price}
              </p>
            </div>
            <span style={{
              backgroundColor: listing.status === 'available' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(204, 0, 0, 0.15)',
              color: listing.status === 'available' ? '#22c55e' : '#CC0000',
              border: `1px solid ${listing.status === 'available' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(204, 0, 0, 0.4)'}`,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '500'
            }}>
              {listing.status === 'available' ? 'Available' : 'Sold'}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={tagStyle}>{listing.category}</span>
          <span style={{ ...tagStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaMapMarkerAlt style={{ fontSize: '11px' }} />
            {listing.proximityTag}
          </span>
          <span style={{
              ...tagStyle,
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
                  : '#CC0000',
            }}>
              {listing.condition}
            </span>
        </div>

        {/* Description */}
        <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 10px' }}>Description</h2>
          <p style={{ color: '#aaaaaa', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
            {listing.description}
          </p>
        </div>

      </div>

      {/* Right panel — seller info + actions */}
      <div style={{
        width: '320px',
        backgroundColor: '#2a2a2a',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderLeft: '1px solid #333'
      }}>

        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>Seller Info</h2>

        {/* Seller card */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <FaUser style={{ color: 'white', fontSize: '18px' }} />
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>{listing.seller.name}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <FaStar style={{ color: '#f5a623', fontSize: '13px' }} />
                <span style={{ color: '#aaaaaa', fontSize: '13px' }}>
                  {listing.seller.rating} ({listing.seller.totalRatings} ratings)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message button */}
        <button
          onClick={() => navigate('/inbox')}
          style={{
            padding: '14px',
            backgroundColor: '#CC0000',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <FaEnvelope />
          Message Seller
        </button>

        <button
          onClick={() => navigate('/listings')}
          style={{
            padding: '14px',
            backgroundColor: 'transparent',
            color: '#aaaaaa',
            border: '1px solid #444',
            borderRadius: '12px',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          ← Back to Listings
        </button>

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