import { useNavigate, useLocation } from 'react-router-dom'
import { FaTag, FaCheckCircle } from 'react-icons/fa'

export default function OrderConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const { title } = location.state || {}

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#1a1a1a',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        borderRadius: '16px',
        padding: '60px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '480px',
        width: '100%',
        textAlign: 'center',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag style={{ fontSize: '24px', color: 'rgba(204,0,0,0.5)' }} />
          <span style={{ color: '#CC0000', fontSize: '24px', fontWeight: 'bold' }}>
            YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
          </span>
        </div>

        {/* Success icon */}
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%',
          backgroundColor: 'rgba(34, 197, 94, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginTop: '8px',
        }}>
          <FaCheckCircle style={{ color: '#22c55e', fontSize: '40px' }} />
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
            Order Confirmed!
          </h1>
          {title && (
            <p style={{ color: '#aaaaaa', fontSize: '15px', margin: 0 }}>
              {title}
            </p>
          )}
          <p style={{ color: '#666', fontSize: '15px', margin: 0, lineHeight: '1.6' }}>
            Your order has been placed successfully. The seller will be in touch with you shortly.
          </p>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', borderTop: '1px solid #333' }} />

        {/* Return to homepage button */}
        <button
          onClick={() => navigate('/listings')}
          style={{
            padding: '14px',
            backgroundColor: '#CC0000',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          Home
        </button>

      </div>
    </div>
  )
}