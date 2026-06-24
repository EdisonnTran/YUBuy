import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  // personal details
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [streetName, setStreetName] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  // payment details
  const [cardNumber, setCardNumber] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [securityCode, setSecurityCode] = useState('')


  const navigate = useNavigate()

  const handleCheckout = () => {
    console.log('Checkout clicked', { email, password })
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      <div style={{ flex: 1, backgroundColor: '#2a2a2a', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h2 style={{ color: '#CC0000', fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span></h2>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginTop: '40px' }}>Welcome Back</h1>
        <p style={{ color: '#aaaaaa', fontSize: '18px', marginTop: '8px' }}>Sign in to your YUBuy account</p>

        <label style={{ color: 'white', marginTop: '32px', marginBottom: '8px' }}>Email</label>
        <input
          type="email"
          placeholder="you@yorku.ca"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px' }}
        />

        <label style={{ color: 'white', marginTop: '24px', marginBottom: '8px' }}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px' }}
        />

        <button
          onClick={handleSignIn}
          style={{ marginTop: '40px', padding: '16px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}
        >
          Sign In
        </button>

        <p style={{ color: 'white', marginTop: '24px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#CC0000', cursor: 'pointer', fontWeight: 'bold' }}>
            Create one now!
          </span>
        </p>
      </div>

      <div style={{ flex: 1, backgroundColor: '#CC0000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>York University's Marketplace</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: '1.6' }}>Buy and sell textbooks, furniture, electronics and more — exclusively for York students.</p>
      </div>

    </div>
  )
}