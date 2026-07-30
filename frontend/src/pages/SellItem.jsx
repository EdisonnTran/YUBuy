import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTag, FaBoxOpen, FaDollarSign, FaMapMarkerAlt, FaClipboardList } from 'react-icons/fa'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const CONDITIONS = ['Like New', 'Good', 'Fair']
const LOCATIONS  = ['Keele Campus', 'Glendon Campus']

const labelStyle = {
  color: '#aaaaaa',
  fontSize: '13px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '8px',
}

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '10px',
  border: '1px solid #333',
  backgroundColor: '#1a1a1a',
  color: 'white',
  fontSize: '15px',
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
}

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '24px',
}

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
  appearance: 'none',
}

const tagStyle = {
  backgroundColor: '#3a3a3a',
  color: '#aaaaaa',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '13px',
}

export default function SellItem() {
  const navigate = useNavigate()

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice]             = useState('')
  const [category, setCategory]       = useState('')
  const [condition, setCondition]     = useState('')
  const [location, setLocation]       = useState('')
  const [categories, setCategories]   = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [userError, setUserError]     = useState(null)
  const [submitError, setSubmitError] = useState(null)

  // Load the currently logged-in user from the session 
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const res = await fetch(`${API_BASE}/api/user/me`, {
          credentials: 'include',
        })
        if (!res.ok) {
          setUserError('You must be logged in to sell an item.')
          return
        }
        const user = await res.json()
        setCurrentUser(user)
      } catch (err) {
        console.error('Failed to load current user:', err)
        setUserError('Could not verify your account. Please try logging in again.')
      }
    }
    loadCurrentUser()
  }, [])

  // Load real categories from the backend instead of hardcoding fake IDs
  // that don't match the actual Category records in the database.
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API_BASE}/api/category`)
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (err) {
        console.error('Failed to load categories:', err)
      }
    }
    loadCategories()
  }, [])

  const handlePriceChange = (e) => {
    const value = e.target.value
    if (/^\d{0,5}(\.\d{0,2})?$/.test(value)) {
      setPrice(value)
    }
  }

  const handleSubmit = async () => {
    if (!currentUser) {
      setSubmitError('You must be logged in to post a listing.')
      return
    }
    setSubmitError(null)
    try {
      const res = await fetch(`${API_BASE}/api/listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          proximity: location,
          condition,
          sellerId: currentUser.id,
          categoryId: category,
        })
      })
      if (!res.ok) throw new Error(`Failed to create listing: ${res.status}`)
      const data = await res.json()
      console.log('Listing created:', data)
      navigate('/profile')
    } catch (err) {
      console.error('Failed to create listing:', err)
      setSubmitError('Could not post your listing. Please try again.')
    }
  }

  const isFormFilled = title && price && category && condition && location

  const selectedCategoryName = categories.find(c => c.id === category)?.name

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>

      {/* Left panel */}
      <div style={{
        width: '300px',
        backgroundColor: '#2a2a2a',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRight: '1px solid #333',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag style={{ fontSize: '24px', color: 'rgba(204,0,0,0.5)' }} />
          <span style={{ color: '#CC0000', fontSize: '24px', fontWeight: 'bold' }}>
            YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
          </span>
        </div>

        {/* Icon + heading */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px 0' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaBoxOpen style={{ color: 'white', fontSize: '36px' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 4px' }}>New Listing</p>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>Fill in the details to post your item</p>
          </div>
        </div>

        {userError && (
          <p style={{ color: '#ff7777', fontSize: '13px', textAlign: 'center' }}>{userError}</p>
        )}

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '14px',
            backgroundColor: 'transparent',
            color: '#aaaaaa',
            border: '1px solid #444',
            borderRadius: '12px',
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: 'auto',
          }}
        >
          ← Back
        </button>

      </div>

      {/* Right panel — form */}
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>

        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>List an Item</h1>

        {/* Item details section */}
        <div>
          <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
            <FaClipboardList style={{ marginRight: '8px' }} />
            Item Details
          </h2>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '28px' }}>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                placeholder="e.g. Calculus Textbook – 10th Edition"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                placeholder="Describe your item — include any relevant details like edition, brand, or included accessories..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                }}
              />
            </div>

            {/* Category + Condition side by side */}
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ ...fieldGroupStyle, flex: 1 }}>
                <label style={labelStyle}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={selectStyle}
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ ...fieldGroupStyle, flex: 1 }}>
                <label style={labelStyle}>Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={selectStyle}
                >
                  <option value="" disabled>Select condition</option>
                  {CONDITIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Pricing + location section */}
        <div>
          <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
            <FaDollarSign style={{ marginRight: '8px' }} />
            Pricing & Location
          </h2>

          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '12px', padding: '28px' }}>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ ...fieldGroupStyle, flex: 1, marginBottom: 0 }}>
                <label style={labelStyle}>Price ($)</label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={price}
                  onChange={handlePriceChange}
                  style={inputStyle}
                />
              </div>

              <div style={{ ...fieldGroupStyle, flex: 1, marginBottom: 0 }}>
                <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FaMapMarkerAlt style={{ fontSize: '11px' }} /> Location
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={selectStyle}
                >
                  <option value="" disabled>Select location</option>
                  {LOCATIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Preview pill tags */}
        {(category || condition || location) && (
          <div>
            <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
              Preview Tags
            </h2>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {selectedCategoryName && (
                <span style={tagStyle}>{selectedCategoryName}</span>
              )}
              {location && (
                <span style={{ ...tagStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FaMapMarkerAlt style={{ fontSize: '11px' }} />{location}
                </span>
              )}
              {condition && (
                <span style={{
                  ...tagStyle,
                  backgroundColor: condition === 'Like New' ? 'rgba(34, 197, 94, 0.15)' :
                                   condition === 'Good'     ? 'rgba(234, 179, 8, 0.15)'  :
                                   'rgba(204, 0, 0, 0.15)',
                  color: condition === 'Like New' ? '#22c55e' :
                         condition === 'Good'     ? '#eab308' :
                         '#CC0000',
                }}>
                  {condition}
                </span>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <p style={{ color: '#ff7777', fontSize: '13px' }}>{submitError}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isFormFilled || !currentUser}
          style={{
            padding: '16px',
            backgroundColor: (isFormFilled && currentUser) ? '#CC0000' : '#3a3a3a',
            color: (isFormFilled && currentUser) ? 'white' : '#666',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: (isFormFilled && currentUser) ? 'pointer' : 'not-allowed',
            width: '100%',
            transition: 'background-color 0.2s',
            marginBottom: '48px',
          }}
        >
          {!currentUser
            ? 'Log in to post a listing'
            : isFormFilled ? 'Post Listing' : 'Fill in required fields to post'}
        </button>

      </div>
    </div>
  )
}
