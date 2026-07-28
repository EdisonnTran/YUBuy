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

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Maps a listing from GET /api/listing/:id into the shape this page renders.
// NOTE: the Listing model has no `condition` field yet, so it falls back to 'Unspecified'.
function normalizeListing(raw) {
  return {
    id: raw.id,
    title: raw.title,
    price: Number(raw.price),
    category: raw.category?.name || 'Other',
    proximityTag: raw.proximity || '',
    condition: raw.condition || 'Unspecified',
    status: raw.status === 'ACTIVE' ? 'available' : 'sold',
    postedDate: formatDate(raw.createdAt),
    description: raw.description || '',
    images: (raw.images || []).map(img => img.url || img),
    seller: { id: raw.seller?.id, name: raw.seller?.name || 'Unknown seller', rating: null, totalRatings: 0 },
  }
}

// TODO: replace this with the authenticated user's email once auth is connected.
const CURRENT_USER_EMAIL = 'alice@my.yorku.ca'

function formatRating(average, count) {
  if (!count) return 'No ratings yet'
  return `${Number(average).toFixed(1)} (${count} ${count === 1 ? 'rating' : 'ratings'})`
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [activeImg, setActiveImg] = useState(0)
  const [loading, setLoading] = useState(true)
  const [ratingSummary, setRatingSummary] = useState({
    average: null,
    count: 0,
    userRating: null,
  })
  const [selectedScore, setSelectedScore] = useState(0)
  const [hoveredScore, setHoveredScore] = useState(0)
  const [comment, setComment] = useState('')
  const [ratingsLoading, setRatingsLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [ratingMessage, setRatingMessage] = useState('')
  const [ratingError, setRatingError] = useState(false)

  useEffect(() => {
    async function loadListing() {
      try {
        const res = await fetch(`${API}/api/listing/${id}`)
        if (!res.ok) throw new Error(`Request failed: ${res.status}`)
        const mapped = normalizeListing(await res.json())

        // Pull the seller's received ratings to show an average (non-blocking).
        try {
          const rRes = await fetch(`${API}/api/rating/subject/${mapped.seller.id}`)
          if (rRes.ok) {
            const ratings = await rRes.json()
            if (Array.isArray(ratings) && ratings.length > 0) {
              const avg = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
              mapped.seller.rating = Math.round(avg * 10) / 10
              mapped.seller.totalRatings = ratings.length
            }
          }
        } catch (e) {
          console.error('Could not load seller ratings:', e)
        }

        setListing(mapped)
      } catch (err) {
        console.error('Could not load listing:', err)
      } finally {
        setLoading(false)
      }
    }
    loadListing()
  }, [id])

  useEffect(() => {
    const controller = new AbortController()

    async function loadRatings() {
      setRatingsLoading(true)
      setRatingError(false)

      try {
        const response = await fetch(
          `${API}/api/ratings/listing/${id}?authorEmail=${encodeURIComponent(CURRENT_USER_EMAIL)}`,
          { signal: controller.signal },
        )

        if (!response.ok) throw new Error(`Rating request failed with status ${response.status}`)

        const summary = await response.json()
        setRatingSummary(summary)
        setSelectedScore(summary.userRating?.score || 0)
        setComment(summary.userRating?.comment || '')
      } catch (error) {
        if (error.name !== 'AbortError') setRatingError(true)
      } finally {
        if (!controller.signal.aborted) setRatingsLoading(false)
      }
    }

    if (id) loadRatings()

    return () => controller.abort()
  }, [id])

  async function handleSubmitRating(event) {
    event.preventDefault()


    if (!selectedScore) {
      setRatingMessage('Choose a star rating first.')
      setRatingError(true)
      return
    }

    setSubmitting(true)
    setRatingMessage('')
    setRatingError(false)

    try {
      const response = await fetch(`${API}/api/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: id,
          authorEmail: CURRENT_USER_EMAIL,
          score: selectedScore,
          comment: comment.trim(),
        }),
      })

      if (!response.ok) throw new Error(`Rating request failed with status ${response.status}`)

      const data = await response.json()
      const summary = data.summary || data
      setRatingSummary(summary)
      setSelectedScore(summary.userRating?.score || selectedScore)
      setComment(summary.userRating?.comment || comment)
      setRatingMessage('Rating saved.')
    } catch {
      setRatingError(true)
      setRatingMessage('Could not save your rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const visibleScore = hoveredScore || selectedScore
  const centerStyle = { minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center' }
  if (loading) return <div style={centerStyle}>Loading listing...</div>
  if (!listing) return <div style={centerStyle}>Listing not found.</div>

  const coords = locationCoordinates[listing.proximityTag]

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

        {/* Map */}
        {coords && (
          <div>
            <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 10px' }}>Pickup Location</h2>
            <MapContainer
              center={[coords.lat, coords.lng]}
              zoom={15}
              style={{ height: '260px', width: '100%', borderRadius: '12px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[coords.lat, coords.lng]}>
                <Popup>
                  <strong>{listing.title}</strong><br />
                  {listing.proximityTag}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

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
                  {listing.seller.rating != null
                    ? `${listing.seller.rating} (${listing.seller.totalRatings} ratings)`
                    : 'No ratings yet'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmitRating} style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px' }}>
          <h2 style={{ color: 'white', fontSize: '16px', fontWeight: '600', margin: '0 0 12px' }}>
            Rate this listing
          </h2>

          <div style={{ display: 'flex', gap: '7px' }} onMouseLeave={() => setHoveredScore(0)}>
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                type="button"
                aria-label={`${score} star rating`}
                aria-pressed={selectedScore === score}
                onClick={() => {
                  setSelectedScore(score)
                  setRatingMessage('')
                  setRatingError(false)
                }}
                onMouseEnter={() => setHoveredScore(score)}
                onFocus={() => setHoveredScore(score)}
                onBlur={() => setHoveredScore(0)}
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
            maxLength={500}
            style={{
              width: '100%',
              margin: '14px 0',
              boxSizing: 'border-box',
              resize: 'vertical',
              border: '1px solid #444',
              borderRadius: '8px',
              backgroundColor: '#2a2a2a',
              color: 'white',
              padding: '10px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />

          <button
            type="submit"
            disabled={submitting || ratingsLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: submitting || ratingsLoading ? '#777' : '#CC0000',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: submitting || ratingsLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? 'Saving...' : ratingSummary.userRating ? 'Update Rating' : 'Submit Rating'}
          </button>

          {ratingMessage && (
            <p style={{ color: ratingError ? '#ff7777' : '#22c55e', fontSize: '13px', margin: '10px 0 0' }}>
              {ratingMessage}
            </p>
          )}
        </form>

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
