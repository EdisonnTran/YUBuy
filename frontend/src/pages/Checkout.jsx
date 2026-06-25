import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const fieldGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '20px',
  width: '100%',
}

export default function Checkout() {
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

  const navigate = useNavigate()

  const handleCheckout = () => {
    console.log('Checkout clicked', {
      firstName, lastName, streetName, city,
      postalCode, country, phoneNumber, cardNumber, expirationDate, securityCode
    })
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
              onChange={(e) => setFirstName(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              placeholder="Smith"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={inputStyle}
            />
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
            </div>

            <div style={{ ...fieldGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Postal Code</label>
              <input
                type="text"
                placeholder="1A2 B3C"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                style={inputStyle}
              />
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
          </div>

          <div style={{ ...fieldGroupStyle, marginBottom: 0 }}>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              placeholder="123-456-7890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={inputStyle}
            />
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

          <div style={{ ...fieldGroupStyle, marginBottom: '36px' }}>
            <label style={{ ...labelStyle, textAlign: 'center' }}>Subtotal</label>
            <div
              style={{
                ...inputStyle,
                textAlign: 'center',
                color: '#181313',
                fontWeight: '600',
              }}
            >
              $0.00
            </div>
            <label style={{ ...labelStyle, textAlign: 'center' }}>Shipping</label>
            <div
              style={{
                ...inputStyle,
                textAlign: 'center',
                color: '#181313',
                fontWeight: '600',
              }}
            >
              $0.00
            </div>
            <label style={{ ...labelStyle, textAlign: 'center' }}>Tax</label>
            <div
              style={{
                ...inputStyle,
                textAlign: 'center',
                color: '#181313',
                fontWeight: '600',
              }}
            >
              $0.00
            </div>

            <label style={{ ...labelStyle, textAlign: 'center' }}>You Pay</label>
            <div
              style={{
                ...inputStyle,
                textAlign: 'center',
                color: '#181313',
                fontWeight: '600',
              }}
            >
              $0.00
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
              onChange={(e) => setCardNumber(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ ...fieldGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Expiration Date</label>
              <input
                type="text"
                placeholder="__/__"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div style={{ ...fieldGroupStyle, flex: 1 }}>
              <label style={labelStyle}>Security Code</label>
              <input
                type="text"
                placeholder="123"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                style={inputStyle}
              />
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