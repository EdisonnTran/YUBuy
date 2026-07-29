import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaTag, FaUser, FaStar, FaMapMarkerAlt, FaEnvelope, FaImage } from 'react-icons/fa'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const locationCoordinates = {
  'Keele Campus':   { lat: 43.7735, lng: -79.5019 },
  'Glendon Campus': { lat: 43.7360, lng: -79.3758 },
  'York Lanes':     { lat: 43.7738, lng: -79.5023 },
  'The Village':    { lat: 43.7745, lng: -79.4998 },
}

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// TODO: replace with the real logged-in user's identity once auth is wired up.
const CURRENT_USER_EMAIL = 'alice@my.yorku.ca'

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatRating(average, count) {
  if (!count) return 'No ratings yet'
  return `${average.toFixed(1)} (${count} ${count === 1 ? 'rating' : 'ratings'})`
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [ratingSummary, setRatingSummary] = useState({
    average: null,
    count: 0,
    userRating: null,
  })
  const [selectedScore, setSelectedScore] = useState(0)
  const [hoveredScore, setHoveredScore] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [ratingMessage, setRatingMessage] = useState('')

  const [uploadingImage, setUploadingImage] = useState(false)

  // Reads the chosen image file as base64 and saves it to this listing via
  // POST /api/image. Images are stored as base64 data URIs so they persist
  // through deploys without needing a separate file host.
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file.')
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      alert('Please choose an image smaller than 4 MB.')
      return
    }
    setUploadingImage(true)
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const res = await fetch(`${API_BASE}/api/image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: base64, listingId: listing.id }),
      })
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`)
      const saved = await res.json()
      const newIndex = listing.images.length
      setListing((prev) => ({ ...prev, images: [...prev.images, saved] }))
      setActiveImg(newIndex)
    } catch (err) {
      console.error('Could not upload image:', err)
      alert('Could not upload image. Please try again.')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  useEffect(() => {
    async function loadListing() {
      setLoading(true)
      setError(null)

      try {
        const [listingResponse, ratingResponse] = await Promise.all([
          fetch(`${API_BASE}/api/listing/${id}`),
          fetch(
            `${API_BASE}/api/rating/listing/${id}?authorEmail=${encodeURIComponent(
              CURRENT_USER_EMAIL,
            )}`,
          ),
        ])

        if (!listingResponse.ok) {
          throw new Error(`Listing request failed with status ${listingResponse.status}`)
        }

        if (!ratingResponse.ok) {
          throw new Error(`Rating request failed with status ${ratingResponse.status}`)
        }

        const listingData = await listingResponse.json()
        const ratingData = await ratingResponse.json()

        setListing(listingData)
        setRatingSummary(ratingData)
        setSelectedScore(ratingData.userRating?.score || 0)
        setComment(ratingData.userRating?.comment || '')
      } catch {
        setError('Could not load this listing. Is the backend server running?')
      } finally {
        setLoading(false)
      }
    }

    loadListing()
  }, [id])

  async function handleSubmitRating(event) {
    event.preventDefault()

    if (!selectedScore) {
      setRatingMessage('Choose a star rating first.')
      return
    }

    setSubmitting(true)
    setRatingMessage('')

    try {
      const response = await fetch(`${API_BASE}/api/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: id,
          authorEmail: CURRENT_USER_EMAIL,
          score: selectedScore,
          comment: comment.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Rating request failed with status ${response.status}`)
      }

      const data = await response.json()
      setRatingSummary(data.summary)
      setSelectedScore(data.summary.userRating?.score || selectedScore)
      setComment(data.summary.userRating?.comment || '')
      setRatingMessage('Rating saved.')
    } catch {
      setRatingMessage('Could not save your rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <PageShell>Loading listing...</PageShell>
  }

  if (error || !listing) {
    return (
      <PageShell>
        <p style={{ color: '#ff7777', margin: 0 }}>{error || 'Listing not found.'}</p>
        <button type="button" onClick={() => navigate('/listings')} style={secondaryButtonStyle}>
          Back to Listings
        </button>
      </PageShell>
    )
  }

  const images = listing.images.map((image) => image.url)
  const statusLabel = listing.status === 'ACTIVE' ? 'Available' : 'Sold'
  const visibleScore = hoveredScore || selectedScore

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <BrandHeader />

        <div style={imageAreaStyle}>
          {images.length > 0 ? (
            <img src={images[activeImg]} alt={listing.title} style={mainImageStyle} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <FaImage style={{ fontSize: '48px', color: '#444' }} />
              <p style={{ color: '#555', fontSize: '14px', margin: 0 }}>No images uploaded</p>
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            {images.map((img, index) => (
              <img
                key={img}
                src={img}
                alt=""
                onClick={() => setActiveImg(index)}
                style={{
                  width: '64px',
                  height: '64px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: index === activeImg ? '2px solid #CC0000' : '2px solid transparent',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>
        )}

        {/* Add a photo (image upload) */}
        <label style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px', alignSelf: 'flex-start',
          padding: '8px 14px', backgroundColor: '#2a2a2a', border: '1px solid #444',
          borderRadius: '8px', color: '#ccc', fontSize: '13px', cursor: 'pointer'
        }}>
          <FaImage style={{ fontSize: '14px' }} />
          {uploadingImage ? 'Uploading...' : 'Add a photo'}
          <input type="file" accept="image/*" onChange={handleImageUpload}
                 disabled={uploadingImage} style={{ display: 'none' }} />
        </label>

        {/* Title, date, price and status badge */}
        <div>
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: '0 0 4px' }}>
            {listing.title}
          </h1>

          <p style={{ color: '#666', fontSize: '13px', margin: '0 0 12px' }}>
            Posted {formatDate(listing.createdAt)}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <p style={labelStyle}>Asking Price</p>
              <p style={{ color: '#CC0000', fontSize: '26px', fontWeight: 'bold', margin: 0 }}>
                ${listing.price}
              </p>
            </div>
            <span style={statusLabelStyle(listing.status)}>{statusLabel}</span>
            <span style={{ color: '#aaaaaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <FaStar style={{ color: '#f5a623', fontSize: '14px' }} />
              {formatRating(ratingSummary.average, ratingSummary.count)}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <span style={tagStyle}>{listing.category.name}</span>
          {listing.proximity && (
            <span style={{ ...tagStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaMapMarkerAlt style={{ fontSize: '11px' }} />
              {listing.proximity}
            </span>
          )}
        </div>

        <div style={panelStyle}>
          <h2 style={panelHeadingStyle}>Description</h2>
          <p style={{ color: '#aaaaaa', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>
            {listing.description}
          </p>
        </div>
      </div>

      <aside style={sidebarStyle}>
        <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>
          Seller Info
        </h2>

        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={avatarStyle}>
              <FaUser style={{ color: 'white', fontSize: '18px' }} />
            </div>
            <div>
              <p style={{ color: 'white', fontWeight: '600', margin: 0 }}>{listing.seller.name}</p>
              <p style={{ color: '#aaaaaa', fontSize: '13px', margin: '4px 0 0' }}>
                {listing.seller.email}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitRating} style={panelStyle}>
          <h2 style={panelHeadingStyle}>Rate this listing</h2>
          <div style={{ display: 'flex', gap: '7px' }}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score} star rating`}
                onClick={() => setSelectedScore(score)}
                onMouseEnter={() => setHoveredScore(score)}
                onMouseLeave={() => setHoveredScore(0)}
                style={{
                  width: '34px',
                  height: '34px',
                  border: 0,
                  backgroundColor: 'transparent',
                  color: score <= visibleScore ? '#f5a623' : '#666',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <FaStar />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Optional comment"
            rows={3}
            style={textareaStyle}
          />

          <button type="submit" disabled={submitting} style={primaryButtonStyle}>
            {submitting ? 'Saving...' : ratingSummary.userRating ? 'Update Rating' : 'Submit Rating'}
          </button>

          {ratingMessage && (
            <p
              style={{
                color: ratingMessage === 'Rating saved.' ? '#22c55e' : '#ff7777',
                fontSize: '13px',
                margin: 0,
              }}
            >
              {ratingMessage}
            </p>
          )}
        </form>

        <button
          type="button"
          onClick={() => console.log('Message seller - connect to backend later')}
          style={primaryButtonStyle}
        >
          <FaEnvelope />
          Message Seller
        </button>

        <button type="button" onClick={() => navigate('/listings')} style={secondaryButtonStyle}>
          Back to Listings
        </button>
      </aside>
    </div>
  )
}

function PageShell({ children }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '48px',
        backgroundColor: '#1a1a1a',
        color: '#aaaaaa',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <BrandHeader />
      {children}
    </div>
  )
}

function BrandHeader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <FaTag style={{ fontSize: '24px', color: 'rgba(204,0,0,0.5)' }} />
      <span style={{ color: '#CC0000', fontSize: '24px', fontWeight: 'bold' }}>
        YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
      </span>
    </div>
  )
}

const imageAreaStyle = {
  backgroundColor: '#2a2a2a',
  borderRadius: '12px',
  height: '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
  fontSize: '14px',
}

const mainImageStyle = {
  maxHeight: '100%',
  maxWidth: '100%',
  borderRadius: '12px',
  objectFit: 'contain',
}

const sidebarStyle = {
  width: '320px',
  backgroundColor: '#2a2a2a',
  padding: '48px 32px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  borderLeft: '1px solid #333',
}

const panelStyle = {
  backgroundColor: '#2a2a2a',
  borderRadius: '12px',
  padding: '20px',
}

const panelHeadingStyle = {
  color: 'white',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 10px',
}

const labelStyle = {
  color: '#666',
  fontSize: '12px',
  margin: '0 0 2px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
}

const tagStyle = {
  backgroundColor: '#3a3a3a',
  color: '#aaaaaa',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '13px',
}

function statusLabelStyle(status) {
  const available = status === 'ACTIVE'

  return {
    backgroundColor: available ? 'rgba(34, 197, 94, 0.15)' : 'rgba(204, 0, 0, 0.15)',
    color: available ? '#22c55e' : '#CC0000',
    border: `1px solid ${available ? 'rgba(34, 197, 94, 0.4)' : 'rgba(204, 0, 0, 0.4)'}`,
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '500',
  }
}

const avatarStyle = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  backgroundColor: '#CC0000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: '0 0 auto',
}

const textareaStyle = {
  width: '100%',
  margin: '14px 0',
  boxSizing: 'border-box',
  resize: 'vertical',
  border: '1px solid #444',
  borderRadius: '8px',
  backgroundColor: '#1a1a1a',
  color: 'white',
  padding: '10px',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
}

const primaryButtonStyle = {
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
  gap: '8px',
}

const secondaryButtonStyle = {
  padding: '14px',
  backgroundColor: 'transparent',
  color: '#aaaaaa',
  border: '1px solid #444',
  borderRadius: '12px',
  fontSize: '15px',
  cursor: 'pointer',
}
