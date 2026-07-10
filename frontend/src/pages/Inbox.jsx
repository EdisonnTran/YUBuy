import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaTag, FaUser, FaArrowLeft, FaPaperPlane, FaImage, FaTimes, FaPlus, FaTrash, FaSearch } from 'react-icons/fa'

const MAX_CHARS = 500

// Placeholder users for new message — will be replaced with real API call later
const mockUsers = [
  { id: 1, name: 'Jane D.' },
  { id: 2, name: 'Mark T.' },
  { id: 3, name: 'Alex K.' },
  { id: 4, name: 'Sara M.' },
]

// Placeholder data — will be replaced with real API call later
const mockConversations = [
  {
    id: 1,
    sellerName: 'Jane D.',
    listingTitle: 'Calculus Textbook – 10th Edition',
    lastMessage: 'Is this still available?',
    timestamp: 'June 24, 2026',
    messages: [
      { id: 1, sender: 'me', text: 'Is this still available?', timestamp: '10:00 AM', image: null },
      { id: 2, sender: 'them', text: 'Yes it is! Are you interested?', timestamp: '10:05 AM', image: null },
      { id: 3, sender: 'me', text: 'Yes, can we meet at Keele campus?', timestamp: '10:08 AM', image: null },
    ]
  },
  {
    id: 2,
    sellerName: 'Mark T.',
    listingTitle: 'IKEA Desk Lamp',
    lastMessage: 'Sure, tomorrow works!',
    timestamp: 'June 22, 2026',
    messages: [
      { id: 1, sender: 'me', text: 'Hey is the lamp still for sale?', timestamp: '9:00 AM', image: null },
      { id: 2, sender: 'them', text: 'Sure, tomorrow works!', timestamp: '9:30 AM', image: null },
    ]
  },
]

export default function Inbox() {
  const navigate = useNavigate()
  const [conversations, setConversations] = useState(mockConversations)
  const [activeConvo, setActiveConvo] = useState(mockConversations[0])
  const [newMessage, setNewMessage] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessageText, setNewMessageText] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  )

  const handleSend = () => {
    if (!newMessage.trim() && !imagePreview) return
    const msg = {
      id: activeConvo.messages.length + 1,
      sender: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      image: imagePreview,
    }
    const updatedConvo = {
      ...activeConvo,
      messages: [...activeConvo.messages, msg],
      lastMessage: newMessage || 'Image',
    }
    setConversations(prev => prev.map(c => c.id === activeConvo.id ? updatedConvo : c))
    setActiveConvo(updatedConvo)
    setNewMessage('')
    setImagePreview(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleDeleteConversation = (convoId) => {
    const updated = conversations.filter(c => c.id !== convoId)
    setConversations(updated)
    setShowDeleteConfirm(null)
    if (activeConvo.id === convoId) {
      setActiveConvo(updated[0] || null)
    }
  }

  const handleCreateConversation = () => {
    if (!selectedUser) return
    const newConvo = {
      id: conversations.length + 1,
      sellerName: selectedUser.name,
      listingTitle: 'New Conversation',
      lastMessage: newMessageText || 'Started a conversation',
      timestamp: 'Just now',
      messages: newMessageText ? [{
        id: 1,
        sender: 'me',
        text: newMessageText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        image: null,
      }] : []
    }
    setConversations(prev => [...prev, newConvo])
    setActiveConvo(newConvo)
    setShowNewMessage(false)
    setSelectedUser(null)
    setUserSearch('')
    setNewMessageText('')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1a1a1a' }}>

      {/* Left panel — conversation list */}
      <div style={{
        width: '320px',
        backgroundColor: '#2a2a2a',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #333'
      }}>

        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <FaTag style={{ fontSize: '20px', color: 'rgba(204,0,0,0.5)' }} />
            <span style={{ color: '#CC0000', fontSize: '20px', fontWeight: 'bold' }}>
              YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: 0 }}>Inbox</h1>
            <button
              onClick={() => setShowNewMessage(true)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#CC0000',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaPlus /> New
            </button>
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {conversations.length === 0 && (
            <p style={{ color: '#666', fontSize: '14px', textAlign: 'center', padding: '24px' }}>No conversations yet</p>
          )}
          {conversations.map(convo => (
            <div
              key={convo.id}
              onClick={() => setActiveConvo(convo)}
              style={{
                padding: '16px 24px',
                cursor: 'pointer',
                backgroundColor: activeConvo?.id === convo.id ? '#1a1a1a' : 'transparent',
                borderLeft: activeConvo?.id === convo.id ? '3px solid #CC0000' : '3px solid transparent',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                position: 'relative'
              }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <FaUser style={{ color: 'white', fontSize: '16px' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '14px', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {convo.sellerName}
                </p>
                <p style={{ color: '#aaaaaa', fontSize: '12px', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {convo.listingTitle}
                </p>
                <p style={{ color: '#666', fontSize: '12px', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {convo.lastMessage}
                </p>
              </div>

              {/* Delete button */}
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(convo.id) }}
                style={{
                  background: 'none', border: 'none',
                  color: '#555', cursor: 'pointer', fontSize: '14px',
                  padding: '4px', flexShrink: 0
                }}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Back button */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #333' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: 'transparent', color: '#aaaaaa',
              border: '1px solid #444', borderRadius: '12px',
              fontSize: '14px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            <FaArrowLeft /> Back
          </button>
        </div>
      </div>

      {/* Right panel — active conversation */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

        {activeConvo ? (
          <>
            {/* Conversation header */}
            <div style={{
              padding: '24px', backgroundColor: '#2a2a2a',
              borderBottom: '1px solid #333',
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%',
                backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FaUser style={{ color: 'white', fontSize: '18px' }} />
              </div>
              <div>
                <p style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>{activeConvo.sellerName}</p>
                <p style={{ color: '#aaaaaa', fontSize: '13px', margin: 0 }}>{activeConvo.listingTitle}</p>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeConvo.messages.map(msg => (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '60%',
                    backgroundColor: msg.sender === 'me' ? '#CC0000' : '#2a2a2a',
                    borderRadius: msg.sender === 'me' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '12px 16px',
                  }}>
                    {msg.image && (
                      <img src={msg.image} alt="uploaded" style={{ maxWidth: '100%', borderRadius: '8px', marginBottom: msg.text ? '8px' : 0 }} />
                    )}
                    {msg.text && (
                      <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px' }}>{msg.text}</p>
                    )}
                    <p style={{ color: msg.sender === 'me' ? 'rgba(255,255,255,0.6)' : '#666', fontSize: '11px', margin: 0, textAlign: 'right' }}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Image preview */}
            {imagePreview && (
              <div style={{ padding: '0 24px 8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={imagePreview} alt="preview" style={{ height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                <button onClick={() => setImagePreview(null)} style={{ background: 'none', border: 'none', color: '#CC0000', cursor: 'pointer', fontSize: '16px' }}>
                  <FaTimes />
                </button>
              </div>
            )}

            {/* Message input */}
            <div style={{ padding: '16px 24px', backgroundColor: '#2a2a2a', borderTop: '1px solid #333' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                <label style={{ cursor: 'pointer', color: '#aaaaaa', fontSize: '20px', paddingBottom: '20px' }}>
                  <FaImage />
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                <div style={{ flex: 1 }}>
                  <textarea
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setNewMessage(e.target.value) }}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                    rows={2}
                    style={{
                      width: '100%', padding: '12px 16px',
                      backgroundColor: '#1a1a1a', border: '1px solid #444',
                      borderRadius: '12px', color: 'white', fontSize: '14px',
                      outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
                    }}
                  />
                  <p style={{ color: newMessage.length >= MAX_CHARS ? '#CC0000' : '#666', fontSize: '11px', margin: '4px 0 0', textAlign: 'right' }}>
                    {newMessage.length}/{MAX_CHARS}
                  </p>
                </div>
                <button
                  onClick={handleSend}
                  style={{
                    padding: '12px 20px', backgroundColor: '#CC0000',
                    color: 'white', border: 'none', borderRadius: '12px',
                    fontSize: '14px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px'
                  }}
                >
                  <FaPaperPlane /> Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#666', fontSize: '16px' }}>No conversation selected</p>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '32px', width: '360px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>Delete Conversation</h2>
            <p style={{ color: '#aaaaaa', fontSize: '14px', margin: 0 }}>Are you sure you want to delete this conversation? This cannot be undone.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                style={{
                  flex: 1, padding: '12px', backgroundColor: 'transparent',
                  color: '#aaaaaa', border: '1px solid #444', borderRadius: '12px',
                  fontSize: '14px', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteConversation(showDeleteConfirm)}
                style={{
                  flex: 1, padding: '12px', backgroundColor: '#CC0000',
                  color: 'white', border: 'none', borderRadius: '12px',
                  fontSize: '14px', cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New message modal */}
      {showNewMessage && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
          <div style={{ backgroundColor: '#2a2a2a', borderRadius: '16px', padding: '32px', width: '400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: 'white', fontSize: '18px', fontWeight: '600', margin: 0 }}>New Message</h2>
              <button
                onClick={() => { setShowNewMessage(false); setSelectedUser(null); setUserSearch('') }}
                style={{ background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', fontSize: '18px' }}
              >
                <FaTimes />
              </button>
            </div>

            {/* User search + dropdown */}
            <div>
              <label style={{ color: '#aaaaaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Send to</label>

              {/* Search input */}
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '13px' }} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={selectedUser ? selectedUser.name : userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value)
                    setSelectedUser(null)
                    setShowUserDropdown(true)
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  style={{
                    width: '100%', padding: '12px 12px 12px 36px',
                    backgroundColor: '#1a1a1a', border: '1px solid #444',
                    borderRadius: '8px', color: 'white', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />

                {/* Dropdown results */}
                {showUserDropdown && !selectedUser && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#1a1a1a', border: '1px solid #444',
                    borderRadius: '8px', marginTop: '4px', zIndex: 10,
                    maxHeight: '160px', overflowY: 'auto'
                  }}>
                    {filteredUsers.length === 0 ? (
                      <p style={{ color: '#666', fontSize: '13px', padding: '12px', margin: 0 }}>No users found</p>
                    ) : (
                      filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => { setSelectedUser(user); setShowUserDropdown(false) }}
                          style={{
                            padding: '10px 16px', cursor: 'pointer', color: 'white',
                            fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px'
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <FaUser style={{ color: 'white', fontSize: '12px' }} />
                          </div>
                          {user.name}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected user pill */}
              {selectedUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{
                    backgroundColor: 'rgba(204,0,0,0.15)', color: '#CC0000',
                    border: '1px solid rgba(204,0,0,0.4)', padding: '4px 12px',
                    borderRadius: '20px', fontSize: '13px',
                    display: 'flex', alignItems: 'center', gap: '6px'
                  }}>
                    {selectedUser.name}
                    <FaTimes
                      onClick={() => { setSelectedUser(null); setUserSearch('') }}
                      style={{ cursor: 'pointer', fontSize: '11px' }}
                    />
                  </span>
                </div>
              )}
            </div>

            {/* Message input */}
            <div>
              <label style={{ color: '#aaaaaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Message (optional)</label>
              <textarea
                placeholder="Type your first message..."
                value={newMessageText}
                onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setNewMessageText(e.target.value) }}
                rows={3}
                style={{
                  width: '100%', padding: '12px',
                  backgroundColor: '#1a1a1a', border: '1px solid #444',
                  borderRadius: '8px', color: 'white', fontSize: '14px',
                  outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
                }}
              />
              <p style={{ color: '#666', fontSize: '11px', margin: '4px 0 0', textAlign: 'right' }}>
                {newMessageText.length}/{MAX_CHARS}
              </p>
            </div>

            <button
              onClick={handleCreateConversation}
              disabled={!selectedUser}
              style={{
                padding: '14px',
                backgroundColor: selectedUser ? '#CC0000' : '#444',
                color: 'white', border: 'none', borderRadius: '12px',
                fontSize: '15px', fontWeight: '500',
                cursor: selectedUser ? 'pointer' : 'not-allowed',
              }}
            >
              Start Conversation
            </button>
          </div>
        </div>
      )}

    </div>
  )
}