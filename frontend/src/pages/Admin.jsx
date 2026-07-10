import { useState } from 'react'
 
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
  if (status === 'Active') return { ...base, backgroundColor: '#1a3a1a', color: '#4caf50' }
  if (status === 'Flagged' || status === 'Reported') return { ...base, backgroundColor: '#3a1a1a', color: '#f44336' }
  return { ...base, backgroundColor: '#3a2e00', color: '#ffb300' }
}
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@my.yorku.ca', joined: 'Jan 12, 2025', reports: 0, status: 'Active' }]
const mockListings = [
  { id: 1, title: 'Calculus Textbook 9th Ed.', seller: 'john.doe@my.yorku.ca', category: 'Textbooks', price: '$45.00', status: 'Active' }]

export default function Admin() {
  const [activeTab, setActiveTab] = useState('listings')
  const [listings, setListings] = useState(mockListings)
  const [users, setUsers] = useState(mockUsers)
 
  const handleRemoveListing = (id) => {
    setListings(listings.filter((l) => l.id !== id))
  }
 
  const handleApproveListing = (id) => {
    setListings(listings.map((l) => l.id === id ? { ...l, status: 'Active' } : l))
  }
 
  const handleBanUser = (id) => {
    setUsers(users.filter((u) => u.id !== id))
  }
 
  return (
    <div style={{ backgroundColor: '#2a2a2a', minHeight: '100vh', padding: '40px 48px', fontFamily: 'sans-serif' }}>
 
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
          YU<span style={{ color: '#CC0000' }}>Buy</span>{' '}
          <span style={{ color: '#aaaaaa', fontWeight: '400', fontSize: '18px' }}>Admin</span>
        </h1>
        <span style={{ color: '#aaaaaa', fontSize: '13px' }}>admin@yorku.ca</span>
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
                <td style={tableCellStyle}>{listing.seller}</td>
                <td style={tableCellStyle}>{listing.category}</td>
                <td style={tableCellStyle}>{listing.price}</td>
                <td style={tableCellStyle}>
                  <span style={getBadgeStyle(listing.status)}>{listing.status}</span>
                </td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{ ...actionBtnStyle, backgroundColor: '#2a2a2a', color: '#4caf50', border: '1px solid #4caf50' }}
                      onClick={() => handleApproveListing(listing.id)}
                    >
                      Approve
                    </button>
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
      )}
 
      {/* Users table */}
      {activeTab === 'users' && (
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
                <td style={tableCellStyle}>{user.joined}</td>
                <td style={tableCellStyle}>{user.reports}</td>
                <td style={tableCellStyle}>
                  <span style={getBadgeStyle(user.status)}>{user.status}</span>
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
      )}
 
    </div>
  )
}