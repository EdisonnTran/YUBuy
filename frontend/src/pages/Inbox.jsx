import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaTag, FaUser, FaArrowLeft, FaPaperPlane, FaImage, FaTimes, FaPlus, FaTrash, FaSearch } from 'react-icons/fa'
import axios from 'axios'

const MAX_CHARS = 500
const API_BASE = 'http://localhost:8080/api/chat'

// Placeholder users — will be replaced with real API call later
const mockUsers = [
  { id: 'user_jane', name: 'Jane D.' },
  { id: 'user_mark', name: 'Mark T.' },
  { id: 'user_alex', name: 'Alex K.' },
  { id: 'user_sara', name: 'Sara M.' },
]

// Current logged in user — will come from auth context later
const CURRENT_USER = { id: 'user_johnmark', name: 'Me' }

export default function Inbox() {
  const navigate = useNavigate()
  const location = useLocation()
  const preloaded = location.state || {}

  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('yubuy_conversations')
    const parsed = saved ? JSON.parse(saved) : []
    if (preloaded.sellerId) {
      const newConvo = {
        chatId: `${CURRENT_USER.id}_${preloaded.sellerId}_${preloaded.listingId}`,
        sellerName: preloaded.sellerName || 'Seller',
        listingTitle: preloaded.listingTitle || 'Listing',
        lastMessage: '',
      }
      const exists = parsed.find(c => c.chatId === newConvo.chatId)
      if (!exists) {
        const updated = [...parsed, newConvo]
        localStorage.setItem('yubuy_conversations', JSON.stringify(updated))
        return updated
      }
    }
    return parsed
  })

  const [activeConvo, setActiveConvo] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [showNewMessage, setShowNewMessage] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessageText, setNewMessageText] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [loading, setLoading] = useState(false)

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase())
  )

  // On mount, auto-select first conversation and fetch its messages
  useEffect(() => {
    const saved = localStorage.getItem('yubuy_conversations')
    const parsed = saved ? JSON.parse(saved) : []
    if (parsed.length > 0) {
      setActiveConvo(parsed[0])
      fetchMessages(parsed[0].chatId)
    }
  }, [])

  const fetchMessages = async (chatId) => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_BASE}/${chatId}`)
      setMessages(res.data)
    } catch (err) {
      console.error('Failed to fetch messages:', err)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectConvo = (convo) => {
    setActiveConvo(convo)
    fetchMessages(convo.chatId)
  }

  const handleSend = async () => {
    if (!newMessage.trim() && !imagePreview) return
    if (!activeConvo) return
    try {
      await axios.post(`${API_BASE}/${activeConvo.chatId}`, {
        senderId: CURRENT_USER.id,
        text: newMessage,
      })
      await fetchMessages(activeConvo.chatId)
      const updated = conversations.map(c =>
        c.chatId === activeConvo.chatId ? { ...c, lastMessage: newMessage } : c
      )
      setConversations(updated)
      localStorage.setItem('yubuy_conversations', JSON.stringify(updated))
      setNewMessage('')
      setImagePreview(null)
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleDeleteConversation = (chatId) => {
    const updated = conversations.filter(c => c.chatId !== chatId)
    setConversations(updated)
    localStorage.setItem('yubuy_conversations', JSON.stringify(updated))
    setShowDeleteConfirm(null)
    if (activeConvo?.chatId === chatId) {
      if (updated.length > 0) {
        setActiveConvo(updated[0])
        fetchMessages(updated[0].chatId)
      } else {
        setActiveConvo(null)
        setMessages([])
      }
    }
  }

  const handleCreateConversation = () => {
    if (!selectedUser) return
    const chatId = `${CURRENT_USER.id}_${selectedUser.id}_general`
    const newConvo = {
      chatId,
      sellerName: selectedUser.name,
      listingTitle: 'New Conversation',
      lastMessage: newMessageText || '',
    }
    const updated = [...conversations, newConvo]
    setConversations(updated)
    localStorage.setItem('yubuy_conversations', JSON.stringify(updated))
    setActiveConvo(newConvo)
    setShowNewMessage(false)
    setSelectedUser(null)
    setUserSearch('')
    if (newMessageText) {
      axios.post(`${API_BASE}/${chatId}`, {
        senderId: CURRENT_USER.id,
        text: newMessageText,
      }).then(() => fetchMessages(chatId))
        .catch(err => console.error('Failed to send first message:', err))
    } else {
      setMessages([])
    }
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
              key={convo.chatId}
              onClick={() => handleSelectConvo(convo)}
              style={{
                padding: '16px 24px',
                cursor: 'pointer',
                backgroundColor: activeConvo?.chatId === convo.chatId ? '#1a1a1a' : 'transparent',
                borderLeft: activeConvo?.chatId === convo.chatId ? '3px solid #CC0000' : '3px solid transparent',
                borderBottom: '1px solid #333',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
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
                  {convo.lastMessage || 'No messages yet'}
                </p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(convo.chatId) }}
                style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: '14px', padding: '4px', flexShrink: 0 }}
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
              {loading && <p style={{ color: '#666', textAlign: 'center' }}>Loading messages...</p>}
              {!loading && messages.length === 0 && (
                <p style={{ color: '#666', textAlign: 'center', fontSize: '14px' }}>No messages yet — say hello!</p>
              )}
              {messages.map((msg, i) => (
                <div key={msg.messageId || i} style={{ display: 'flex', justifyContent: msg.senderId === CURRENT_USER.id ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '60%',
                    backgroundColor: msg.senderId === CURRENT_USER.id ? '#CC0000' : '#2a2a2a',
                    borderRadius: msg.senderId === CURRENT_USER.id ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    padding: '12px 16px',
                  }}>
                    <p style={{ color: 'white', fontSize: '14px', margin: '0 0 4px' }}>{msg.text}</p>
                    <p style={{ color: msg.senderId === CURRENT_USER.id ? 'rgba(255,255,255,0.6)' : '#666', fontSize: '11px', margin: 0, textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
              <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', color: '#aaaaaa', border: '1px solid #444', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={() => handleDeleteConversation(showDeleteConfirm)} style={{ flex: 1, padding: '12px', backgroundColor: '#CC0000', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}>
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
              <button onClick={() => { setShowNewMessage(false); setSelectedUser(null); setUserSearch('') }} style={{ background: 'none', border: 'none', color: '#aaaaaa', cursor: 'pointer', fontSize: '18px' }}>
                <FaTimes />
              </button>
            </div>

            {/* User search + dropdown */}
            <div>
              <label style={{ color: '#aaaaaa', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Send to</label>
              <div style={{ position: 'relative' }}>
                <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#666', fontSize: '13px' }} />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={selectedUser ? selectedUser.name : userSearch}
                  onChange={(e) => { setUserSearch(e.target.value); setSelectedUser(null); setShowUserDropdown(true) }}
                  onFocus={() => setShowUserDropdown(true)}
                  style={{
                    width: '100%', padding: '12px 12px 12px 36px',
                    backgroundColor: '#1a1a1a', border: '1px solid #444',
                    borderRadius: '8px', color: 'white', fontSize: '14px',
                    outline: 'none', boxSizing: 'border-box'
                  }}
                />
                {showUserDropdown && !selectedUser && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#1a1a1a', border: '1px solid #444',
                    borderRadius: '8px', marginTop: '4px', zIndex: 10,
                    maxHeight: '160px', overflowY: 'auto'
                  }}>
                    {filteredUsers.length === 0
                      ? <p style={{ color: '#666', fontSize: '13px', padding: '12px', margin: 0 }}>No users found</p>
                      : filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => { setSelectedUser(user); setShowUserDropdown(false) }}
                          style={{ padding: '10px 16px', cursor: 'pointer', color: 'white', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2a2a2a'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FaUser style={{ color: 'white', fontSize: '12px' }} />
                          </div>
                          {user.name}
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
              {selectedUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ backgroundColor: 'rgba(204,0,0,0.15)', color: '#CC0000', border: '1px solid rgba(204,0,0,0.4)', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {selectedUser.name}
                    <FaTimes onClick={() => { setSelectedUser(null); setUserSearch('') }} style={{ cursor: 'pointer', fontSize: '11px' }} />
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