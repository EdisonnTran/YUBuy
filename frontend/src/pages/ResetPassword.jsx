import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FaLock, FaEye, FaEyeSlash, FaTag } from 'react-icons/fa'
import axios from 'axios'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setError('All fields are required')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setError('')
    try {
      await axios.post('http://localhost:8080/api/user/reset-password', { 
        token, 
        password 
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError('Reset failed. Your link may have expired.')
      console.error(err)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>

      {/* Left side */}
      <div style={{ flex: 1, backgroundColor: '#2a2a2a', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
          <FaTag style={{ fontSize: '32px', color: 'rgba(204,0,0,0.3)' }} />
          <h2 style={{ color: '#CC0000', fontSize: '32px', fontWeight: 'bold', margin: '0' }}>YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span></h2>
        </div>

        {success ? (
          <>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginTop: '40px' }}>Password reset!</h1>
            <p style={{ color: '#aaaaaa', fontSize: '16px', marginTop: '8px' }}>Your password has been updated. Redirecting you to login...</p>
          </>
        ) : (
          <>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginTop: '40px' }}>Reset your password</h1>
            <p style={{ color: '#aaaaaa', fontSize: '16px', marginTop: '8px' }}>Enter your new password below.</p>

            <div style={{ position: 'relative', marginTop: '32px' }}>
              <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 36px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
              />
              {showPassword
                ? <FaEyeSlash onClick={() => setShowPassword(false)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
                : <FaEye onClick={() => setShowPassword(true)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
              }
            </div>

            <div style={{ position: 'relative', marginTop: '16px' }}>
              <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 36px 12px 36px', borderRadius: '8px', border: 'none', backgroundColor: '#a4a4a4', color: 'white', fontSize: '16px', boxSizing: 'border-box' }}
              />
              {showConfirmPassword
                ? <FaEyeSlash onClick={() => setShowConfirmPassword(false)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
                : <FaEye onClick={() => setShowConfirmPassword(true)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'white', cursor: 'pointer' }} />
              }
            </div>

            <p style={{ color: '#aaaaaa', fontSize: '13px', marginTop: '8px' }}>Must be at least 8 characters</p>

            {error && <p style={{ color: '#ff4444', fontSize: '13px', marginTop: '8px' }}>{error}</p>}

            <button
              onClick={handleReset}
              style={{ marginTop: '32px', padding: '16px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}
            >
              Reset Password
            </button>

            <p style={{ color: 'white', marginTop: '24px', textAlign: 'center' }}>
              <span onClick={() => navigate('/login')} style={{ color: '#CC0000', cursor: 'pointer', fontWeight: 'bold' }}>
                ← Back to Sign In
              </span>
            </p>
          </>
        )}
      </div>

      {/* Right side */}
      <div style={{ flex: 1, backgroundColor: '#CC0000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', textAlign: 'center' }}>
        <FaTag style={{ fontSize: '80px', color: 'rgba(255,255,255,0.3)', marginBottom: '24px' }} />
        <h2 style={{ color: 'white', fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>York University's Marketplace</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '18px', lineHeight: '1.6' }}>Buy and sell textbooks, furniture, electronics and more — exclusively for York students.</p>
      </div>

    </div>
  )
}