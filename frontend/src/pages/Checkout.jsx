import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const labelStyle = {
  color: 'white',
  fontSize: '14px',
  marginBottom: '6px',
}

const inputStyle = {
  padding: '12px',
  borderRadius: '8px',
  border: 'none',
  backgroundColor: '#a4a4a4',
  color: 'white',
  fontSize: '16px',
  width: '100%',
  boxSizing: 'border-box',
}

const errorStyle = {
  color: '#ffaaaa',
  fontSize: '12px',
  marginTop: '4px',
}

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
  width: '100%',
}

export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()

  // Listing info passed from the "Buy Now" button on ListingDetails.
  // If someone lands here directly without picking a listing, fall back
  // gracefully instead of showing broken/blank pricing.
  const { listingId, title, price } = location.state || {}
  const subtotal = price ? parseFloat(price) : 0
  // Local campus pickup — no shipping or tax for now.
  const shipping = 0
  const tax = 0
  const total = subtotal + shipping + tax

  // personal details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [streetName, setStreetName] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // payment details
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [securityCode, setSecurityCode] = useState('')

  // errors
  const [errors, setErrors] = useState({})

  // -- input handlers --

  const handleNameInput = (setter) => (e) => {
    // letters, spaces, hyphens only (covers names like "Mary-Jane")
    const value = e.target.value
    if (/^[a-zA-Z\s\-]{0,50}$/.test(value)) {
      setter(value)
    }
  }

  const handlePostalCode = (e) => {
    // Canadian format: A1A 1A1 — allow partial input as user types
    const value = e.target.value.toUpperCase()
    if (/^[A-Z]?\d?[A-Z]?\s?\d?[A-Z]?\d?$/.test(value)) {
      setPostalCode(value)
    }
  }

  const handlePhoneNumber = (e) => {
    const value = e.target.value
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value)
    }
  }

  const handleCreditCardNumber = (e) => {
    const value = e.target.value
    if (/^\d{0,16}$/.test(value)) {
      setCardNumber(value)
    }
  }

  const handleExpirationDate = (e) => {
    const value = e.target.value
    if (/^\d{0,2}\/?\d{0,2}$/.test(value)) {
      setExpirationDate(value)
    }
  }

  const handleSecurityCode = (e) => {
    const value = e.target.value
    if (/^\d{0,3}$/.test(value)) {
      setSecurityCode(value)
    }
  }

  // -- validation on submit --

  const validate = () => {
    const newErrors = {}

    if (!firstName.trim())                        newErrors.firstName    = 'First name is required'
    if (!lastName.trim())                         newErrors.lastName     = 'Last name is required'
    if (!streetName.trim())                       newErrors.streetName   = 'Street name is required'
    if (!city.trim())                             newErrors.city         = 'City is required'
    if (!country.trim())                          newErrors.country      = 'Country is required'

    // Canadian postal code: A1A 1A1
    if (!/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/.test(postalCode))
      newErrors.postalCode = 'Enter a valid postal code (e.g. A1A 1A1)'

    if (phoneNumber.length !== 10)
      newErrors.phoneNumber = 'Phone number must be 10 digits'

    if (cardNumber.length !== 16)
      newErrors.cardNumber = 'Card number must be 16 digits'

    // expiration: MM/YY where MM is 01-12
    if (!/^\d{2}\/\d{2}$/.test(expirationDate)) {
      newErrors.expirationDate = 'Enter a valid expiration date (MM/YY)'
    } else {
      const month = parseInt(expirationDate.slice(0, 2))
      if (month < 1 || month > 12)
        newErrors.expirationDate = 'Month must be between 01 and 12'
    }

    if (securityCode.length !== 3)
      newErrors.securityCode = 'Security code must be 3 digits'

    return newErrors
  }

  const handleCheckout = async () => {
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) return

    try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/listing/${listingId}/purchase`, {
            method: 'PATCH',
        })
        if (!res.ok) throw new Error(`Purchase failed: ${res.status}`)
        navigate('/order-confirmation', { state: { title } })
    } catch (err) {
        console.error('Checkout failed:', err)
        setErrors({ checkout: 'Could not complete checkout. Please try again.' })
    }
}

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* Personal details */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#2a2a2a',
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%', margin: '0 auto' }}>
          <h2 style={{ color: '#CC0000', fontSize: '32px', fontWeight: 'bold', marginTop: 0, marginBottom: '36px' }}>
            Check<span style={{ color: 'white', fontWeight: '400' }}>out</span>
          </h2>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              placeholder="John"
              value={firstName}
              onChange={handleNameInput(setFirstName)}
              style={inputStyle}
            />
            {errors.firstName && <span style={errorStyle}>{errors.firstName}</span>}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={handleNameInput(setLastName)}
              style={inputStyle}
            />
            {errors.lastName && <span style={errorStyle}>{errors.lastName}</span>}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Street Name</label>
            <input
              type="text"
              placeholder="123 Avenue"
              value={streetName}
              onChange={(e) => setStreetName(e.target.value)}
              style={inputStyle}
            />
            {errors.streetName && <span style={errorStyle}>{errors.streetName}</span>}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...fieldGroupStyle, flex: 2 }}>
              <label style={labelStyle}>City</label>
              <input
                type="text"
                placeholder="Downtown"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={inputStyle}
              />
              {errors.city && <span style={errorStyle}>{errors.city}</span>}
            </div>

            <div style={{ ...fieldGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Postal Code</label>
              <input
                type="text"
                placeholder="A1A 1A1"
                value={postalCode}
                onChange={handlePostalCode}
                style={inputStyle}
              />
              {errors.postalCode && <span style={errorStyle}>{errors.postalCode}</span>}
            </div>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Country</label>
            <input
              type="text"
              placeholder="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={inputStyle}
            />
            {errors.country && <span style={errorStyle}>{errors.country}</span>}
          </div>

          <div style={{ ...fieldGroupStyle, marginBottom: 0 }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              placeholder="1234567890"
              value={phoneNumber}
              onChange={handlePhoneNumber}
              style={inputStyle}
            />
            {errors.phoneNumber && <span style={errorStyle}>{errors.phoneNumber}</span>}
          </div>
        </div>
      </div>

      {/* Order summary + payment details */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#CC0000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
          overflowY: 'auto',
        }}
      >
        <div style={{ maxWidth: '420px', width: '100%' }}>

          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>
            Order Summary
          </h2>

          {title && (
            <p style={{ color: 'white', textAlign: 'center', fontSize: '15px', marginTop: '-10px', marginBottom: '20px' }}>
              {title}
            </p>
          )}

          <div style={{ ...fieldGroupStyle, marginBottom: '36px' }}>
            <label style={{ ...labelStyle, textAlign: 'center' }}>Subtotal</label>
            <div style={{ ...inputStyle, textAlign: 'center', color: '#181313', fontWeight: '600' }}>
              ${subtotal.toFixed(2)}
            </div>
            <label style={{ ...labelStyle, textAlign: 'center', marginTop: '12px' }}>Shipping</label>
            <div style={{ ...inputStyle, textAlign: 'center', color: '#181313', fontWeight: '600' }}>
              ${shipping.toFixed(2)}
            </div>
            <label style={{ ...labelStyle, textAlign: 'center', marginTop: '12px' }}>Tax</label>
            <div style={{ ...inputStyle, textAlign: 'center', color: '#181313', fontWeight: '600' }}>
              ${tax.toFixed(2)}
            </div>
            <label style={{ ...labelStyle, textAlign: 'center', marginTop: '12px' }}>You Pay</label>
            <div style={{ ...inputStyle, textAlign: 'center', color: '#181313', fontWeight: '600' }}>
              ${total.toFixed(2)}
            </div>
          </div>

          <h2 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', textAlign: 'center', marginTop: 0, marginBottom: '20px' }}>
            Payment Details
          </h2>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Card Number</label>
            <input
              type="text"
              placeholder="1234567890123456"
              value={cardNumber}
              onChange={handleCreditCardNumber}
              style={inputStyle}
            />
            {errors.cardNumber && <span style={errorStyle}>{errors.cardNumber}</span>}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...fieldGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Expiration Date</label>
              <input
                type="text"
                placeholder="MM/YY"
                value={expirationDate}
                onChange={handleExpirationDate}
                style={inputStyle}
              />
              {errors.expirationDate && <span style={errorStyle}>{errors.expirationDate}</span>}
            </div>

            <div style={{ ...fieldGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Security Code</label>
              <input
                type="text"
                placeholder="123"
                value={securityCode}
                onChange={handleSecurityCode}
                style={inputStyle}
              />
              {errors.securityCode && <span style={errorStyle}>{errors.securityCode}</span>}
            </div>
          </div>

          <button
            onClick={handleCheckout}
            style={{
              marginTop: '24px',
              padding: '16px',
              backgroundColor: '#181313',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '500',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            Checkout
          </button>
        </div>
      </div>

    </div>
  )
}
