import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTag } from 'react-icons/fa'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetSubmitted, setResetSubmitted] = useState(false)
  const [showVerifyCode, setShowVerifyCode] = useState(false)
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const navigate = useNavigate()

  const handleSignIn = () => {
    if (!email || !password) {
      setError('All fields are required')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setError('')
    console.log('Sign in clicked', { email, password })
    // will connect to backend later
    setShowVerifyCode(true)
  }

  const handleVerifyCode = () => {
    if (!code || code.length < 6) {
      setCodeError('Please enter the 6 digit code')
      return
    }
    setCodeError('')
    console.log('Code verified:', code)
    // will connect to backend later
    navigate('/listings')
  }

  const handleResetSubmit = () => {
    if (!resetEmail) {
      setResetError('Please enter your email')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(resetEmail)) {
      setResetError('Please enter a valid email address')
      return
    }
    setResetError('')
    setResetSubmitted(true)
    console.log('Reset link sent to:', resetEmail)
    // will connect to backend later
  }

  const closePopup = () => {
    setShowForgotPassword(false)
    setResetSubmitted(false)
    setResetEmail('')
    setResetError('')
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* Verify Code Popup */}
      {showVerifyCode && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '40px', width: '400px', position: 'relative' }}>
            <button onClick={() => setShowVerifyCode(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#aaaaaa', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Check your email!</h2>
            <p style={{ color: '#aaaaaa', fontSize: '14px', marginBottom: '24px' }}>We sent a 6 digit verification code to <span style={{ color: 'white' }}>{email}</span></p>
            <input
              type="text"
              placeholder="000000"
              value={code}
              maxLength={6}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '24px', boxSizing: 'border-box', textAlign: 'center', letterSpacing: '8px' }}
            />
            {codeError && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '8px' }}>{codeError}</p>}
            <button onClick={handleVerifyCode} style={{ marginTop: '24px', width: '100%', padding: '14px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>Verify</button>
            <p style={{ color: '#aaaaaa', fontSize: '13px', marginTop: '16px', textAlign: 'center' }}>Didn't get it? <span onClick={() => console.log('resend code')} style={{ color: '#CC0000', cursor: 'pointer' }}>Resend code</span></p>
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '40px', width: '400px', position: 'relative' }}>
            <button onClick={closePopup} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#aaaaaa', fontSize: '20px', cursor: 'pointer' }}>✕</button>
            {!resetSubmitted ? (
              <>
                <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Forgot password?</h2>
                <p style={{ color: '#aaaaaa', fontSize: '14px', marginBottom: '24px' }}>Enter your email and we'll send you a reset link.</p>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px 12px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
                  />
                </div>
                {resetError && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '8px' }}>{resetError}</p>}
                <button onClick={handleResetSubmit} style={{ marginTop: '24px', width: '100%', padding: '14px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}>
                  Send reset link
                </button>
              </>
            ) : (
              <>
                <h2 style={{ color: 'white', fontSize: '22px', fontWeight: 'bold', marginBottom: '8px' }}>Check your email!</h2>
                <p style={{ color: '#aaaaaa', fontSize: '14px', marginBottom: '16px' }}>We sent a reset link to <span style={{ color: 'white' }}>{resetEmail}</span></p>
                <p style={{ color: '#aaaaaa', fontSize: '13px' }}>Didn't get it? <span onClick={() => setResetSubmitted(false)} style={{ color: '#CC0000', cursor: 'pointer' }}>Try again</span></p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Left side for login fields */}
      <div style={{ flex: 1, backgroundColor: '#2a2a2a', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <FaTag style={{ fontSize: '32px', color: 'rgba(204,0,0,0.3)' }} />
          <h2 style={{ color: '#CC0000', fontSize: '32px', fontWeight: 'bold', margin: '0' }}>YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span></h2>
        </div>

        <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginTop: '40px' }}>Welcome Back</h1>
        <p style={{ color: '#aaaaaa', fontSize: '18px', marginTop: '8px' }}>Sign in to your YUBuy account</p>

        <div style={{ position: 'relative', marginTop: '32px' }}>
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
            style={{ width: '100%', padding: '12px 36px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
          />
          {showPassword
            ? <FaEyeSlash onClick={() => setShowPassword(false)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
            : <FaEye onClick={() => setShowPassword(true)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
          }
        </div>

        {/* Forgot password link */}
        <p onClick={() => setShowForgotPassword(true)} style={{ color: '#CC0000', fontSize: '13px', marginTop: '8px', cursor: 'pointer', textAlign: 'right' }}>
          Forgot password?
        </p>

        {error && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '8px' }}>{error}</p>}

        <button onClick={handleSignIn} style={{ marginTop: '40px', padding: '16px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}>
          Sign In
        </button>

        <p style={{ color: 'white', marginTop: '24px', textAlign: 'center' }}>
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')} style={{ color: '#CC0000', cursor: 'pointer', fontWeight: 'bold' }}>
            Create one now!
          </span>
        </p>
      </div>

      {/* Right side, YUBuy branding */}
      <div style={{ flex: 1, backgroundColor: '#CC0000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center' }}>
        <FaTag style={{ fontSize: '80px', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }} />
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>York University's Marketplace</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: '1.6' }}>Buy and sell textbooks, furniture, electronics and more — exclusively for York students.</p>
      </div>

    </div>
  )
}