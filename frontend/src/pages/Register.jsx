import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTag } from 'react-icons/fa'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = () => {
    if (!name || !email || !password) {
      setError('All fields are required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    console.log('Register clicked', { name, email, password })
    // will connect to backend later
    navigate('/listings')

  }

  // Left side for registration fields
  return (
   <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, backgroundColor: '#2a2a2a', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <FaTag style={{ fontSize: '32px', color: 'rgba(204,0,0,0.3)' }} />
          <h2 style={{ color: '#CC0000', fontSize: '32px', fontWeight: 'bold', margin: '0' }}>YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span></h2>
        </div>
        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginTop: '40px' }}>Create your account</h1>
        
        <div style={{ position: 'relative', marginTop: '32px' }}>
          <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ position: 'relative', marginTop: '16px' }}>
          <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ position: 'relative', marginTop: '16px' }}>
          <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
          />
          {showPassword
            ? <FaEyeSlash onClick={() => setShowPassword(false)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
            : <FaEye onClick={() => setShowPassword(true)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
          }
        </div>

        {error
          ? <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '8px' }}>{error}</p>
          : <p style={{ color: '#aaaaaa', fontSize: '13px', marginTop: '8px' }}>Must be 8 characters at least</p>
        }

        <button
          onClick={handleRegister}
          style={{ marginTop: '32px', padding: '16px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}
        >
          Register
        </button>

        <p style={{ color: 'white', marginTop: '24px', textAlign: 'center' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#CC0000', cursor: 'pointer', fontWeight: 'bold' }}>
            Sign in
          </span>
        </p>
      </div>
        {/* Right side, YUBuy branding*/}
      <div style={{ flex: 1, backgroundColor: '#CC0000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center' }}>
        <FaTag style={{ fontSize: '80px', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }} />
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>York University's Marketplace</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: '1.6' }}>Buy and sell textbooks, furniture, electronics and more — exclusively for York students.</p>
      </div>

    </div>
  )
}