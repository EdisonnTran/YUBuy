import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const tableHeaderStyle = {
  color: '#aaaaaa',
  fontSize: '12px',
  fontWeight: '600',
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '1px solid #3a3a3a',
}

const tableCellStyle = {
  color: 'white',
  fontSize: '14px',
  padding: '12px',
  borderBottom: '1px solid #333333',
}

const tabActiveStyle = {
  padding: '10px 24px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#CC0000',
  color: 'white',
}

const tabInactiveStyle = {
  padding: '10px 24px',
  border: 'none',
  borderRadius: '8px',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer',
  backgroundColor: '#3a3a3a',
  color: '#aaaaaa',
}

const actionBtnStyle = {
  padding: '6px 14px',
  border: 'none',
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: '500',
  cursor: 'pointer',
}

const getBadgeStyle = (status) => {
  const base = {
    display: 'inline-block',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
  }
  if (status === 'ACTIVE') return { ...base, backgroundColor: '#1a3a1a', color: '#4caf50' }
  if (status === 'SOLD' || status === 'REMOVED') return { ...base, backgroundColor: '#3a1a1a', color: '#f44336' }
  return { ...base, backgroundColor: '#3a2e00', color: '#ffb300' }
}

export default function Admin() {
  const [activeTab, setActiveTab] = useState('listings')
  const [listings, setListings] = useState([])
  const [users, setUsers] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const navigate = useNavigate()

  // fetch listings on mount
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/listing`, { credentials: 'include' })
        const data = await res.json()
        setListings(data)
      } catch (err) {
        console.error('Failed to fetch listings:', err)
      } finally {
        setLoadingListings(false)
      }
    }
    fetchListings()
  }, [])

  // fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user`, { credentials: 'include' })
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error('Failed to fetch users:', err)
      } finally {
        setLoadingUsers(false)
      }
    }
    fetchUsers()
  }, [])

  // remove listings from listings page and in db
  const handleRemoveListing = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/listing`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id })
      })
      if (!res.ok) {
        alert('Could not delete listing.')
        return
      }
      setListings(listings.filter((l) => l.id !== id))
    } catch (err) {
      console.error('Failed to delete listing:', err)
      alert('Could not delete listing. Please try again.')
    }
  }

  // delete a user and remove them from db
  const handleBanUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/user/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.error || 'Could not delete user.')
        return
      }
      setUsers(users.filter((u) => u.id !== id))
    } catch (err) {
      console.error('Failed to delete user:', err)
      alert('Could not delete user. Please try again.')
    }
  }

  return (
    <div style={{ backgroundColor: '#2a2a2a', minHeight: '100vh', padding: '40px 48px', fontFamily: 'sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          YU<span style={{ color: '#CC0000' }}>Buy</span>{' '}
          <span style={{ color: '#aaaaaa', fontWeight: '400', fontSize: '18px' }}>Admin</span>
        </h1>
        <button
          type="button"
          onClick={() => navigate('/listings')}
          style={{
            padding: '10px 18px',
            border: '1px solid #444',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            color: '#aaaaaa',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          ← Back to Listings
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        <button style={activeTab === 'listings' ? tabActiveStyle : tabInactiveStyle} onClick={() => setActiveTab('listings')}>
          Manage Listings
        </button>
        <button style={activeTab === 'users' ? tabActiveStyle : tabInactiveStyle} onClick={() => setActiveTab('users')}>
          Manage Users
        </button>
      </div>

      {/* Listings table */}
      {activeTab === 'listings' && (
        loadingListings ? (
          <p style={{ color: '#aaaaaa' }}>Loading listings...</p>
        ) : listings.length === 0 ? (
          <p style={{ color: '#aaaaaa' }}>No listings found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Title</th>
                <th style={tableHeaderStyle}>Seller</th>
                <th style={tableHeaderStyle}>Category</th>
                <th style={tableHeaderStyle}>Price</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id}>
                  <td style={tableCellStyle}>{listing.title}</td>
                  <td style={tableCellStyle}>{listing.sellerId}</td>
                  <td style={tableCellStyle}>{listing.categoryId}</td>
                  <td style={tableCellStyle}>${listing.price}</td>
                  <td style={tableCellStyle}>
                    <span style={getBadgeStyle(listing.status ?? 'ACTIVE')}>{listing.status ?? 'ACTIVE'}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        style={{ ...actionBtnStyle, backgroundColor: '#CC0000', color: 'white' }}
                        onClick={() => handleRemoveListing(listing.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

      {/* Users table */}
      {activeTab === 'users' && (
        loadingUsers ? (
          <p style={{ color: '#aaaaaa' }}>Loading users...</p>
        ) : users.length === 0 ? (
          <p style={{ color: '#aaaaaa' }}>No users found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Joined</th>
                <th style={tableHeaderStyle}>Reports</th>
                <th style={tableHeaderStyle}>Status</th>
                <th style={tableHeaderStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={tableCellStyle}>{user.name}</td>
                  <td style={tableCellStyle}>{user.email}</td>
                  <td style={tableCellStyle}>{user.joined ?? 'N/A'}</td>
                  <td style={tableCellStyle}>{user.reports ?? 0}</td>
                  <td style={tableCellStyle}>
                    <span style={getBadgeStyle(user.status ?? 'Active')}>{user.status ?? 'Active'}</span>
                  </td>
                  <td style={tableCellStyle}>
                    <button
                      style={{ ...actionBtnStyle, backgroundColor: '#181313', color: 'white' }}
                      onClick={() => handleBanUser(user.id)}
                    >
                      Ban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}

    </div>
  )
}
