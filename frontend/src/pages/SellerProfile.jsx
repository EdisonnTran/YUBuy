import { useNavigate } from 'react-router-dom'
import { FaTag, FaUser, FaStar, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa'

const mockSeller = {
  name: 'Jane D.',
  email: 'jane.d@yorku.ca',
  rating: 4.3,
  totalRatings: 12,
  memberSince: 'September 2024',
  listings: [
    {
      id: 1,
      title: 'Calculus Textbook – 10th Edition',
      price: 45,
      category: 'Textbooks',
      proximityTag: 'Keele Campus',
      condition: 'Like New',
      status: 'available',
      postedDate: 'June 24, 2026',
    },
    {
      id: 2,
      title: 'IKEA Desk Lamp',
      price: 15,
      category: 'Furniture',
      proximityTag: 'Glendon Campus',
      condition: 'Good',
      status: 'available',
      postedDate: 'June 22, 2026',
    },
    {
      id: 3,
      title: 'Scientific Calculator',
      price: 20,
      category: 'Electronics',
      proximityTag: 'Keele Campus',
      condition: 'Fair',
      status: 'sold',
      postedDate: 'June 10, 2026',
    },
  ]
}

export default function SellerProfile() {
  const navigate = useNavigate()
  const seller = mockSeller

  const activeListing = seller.listings.filter(l => l.status === 'available')
  const soldListings = seller.listings.filter(l => l.status === 'sold')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#1a1a1a' }}>

      {/* Left panel — seller info */}
      <div style={{
        width: '300px',
        backgroundColor: '#2a2a2a',
        padding: '48px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        borderRight: '1px solid #333'
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FaTag style={{ fontSize: '24px', color: 'rgba(204,0,0,0.5)' }} />
          <span style={{ color: '#CC0000', fontSize: '24px', fontWeight: 'bold' }}>
            YU<span style={{ color: 'white', fontWeight: '400' }}>Buy</span>
          </span>
        </div>

        {/* Avatar */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '24px 0' }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: '#CC0000', display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FaUser style={{ color: 'white', fontSize: '36px' }} />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', fontSize: '20px', fontWeight: '600', margin: '0 0 4px' }}>{seller.name}</p>
            <p style={{ color: '#666', fontSize: '13px', margin: 0 }}>{seller.email}</p>
          </div>

          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FaStar style={{ color: '#f5a623', fontSize: '16px' }} />
            <span style={{ color: 'white', fontSize: '16px', fontWeight: '600' }}>{seller.rating}</span>
            <span style={{ color: '#666', fontSize: '13px' }}>({seller.totalRatings} ratings)</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Active Listings</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{activeListing.length}</span>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Items Sold</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{soldListings.length}</span>
          </div>
          <div style={{ borderTop: '1px solid #2a2a2a' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: '14px' }}>Member Since</span>
            <span style={{ color: 'white', fontWeight: '600' }}>{seller.memberSince}</span>
          </div>
        </div>

        {/* navigate(-1) will be used later when full routing is set up */}
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '14px',
            backgroundColor: 'transparent',
            color: '#aaaaaa',
            border: '1px solid #444',
            borderRadius: '12px',
            fontSize: '15px',
            cursor: 'pointer',
            marginTop: 'auto'
          }}
        >
          ← Back
        </button>

      </div>

      {/* Right panel — listings */}
      <div style={{ flex: 1, padding: '48px', display: 'flex', flexDirection: 'column', gap: '32px' }}>

        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>My Listings</h1>

        {/* Active listings */}
        <div>
          <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
            Active ({activeListing.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeListing.map(listing => (
              // navigate will be passed here later when listing detail linking is set up
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>

        {/* Sold listings */}
        {soldListings.length > 0 && (
          <div>
            <h2 style={{ color: '#aaaaaa', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.8px', margin: '0 0 16px' }}>
              Sold ({soldListings.length})
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {soldListings.map(listing => (
                // navigate will be passed here later when listing detail linking is set up
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

// navigate is not passed in yet — will be added later when Edit button links to a page
function ListingCard({ listing }) {
  return (
    <div style={{
      backgroundColor: '#2a2a2a',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      opacity: listing.status === 'sold' ? 0.6 : 1
    }}>

      {/* Left side info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <p style={{ color: 'white', fontWeight: '600', fontSize: '16px', margin: 0 }}>{listing.title}</p>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={tagStyle}>{listing.category}</span>
          <span style={{ ...tagStyle, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FaMapMarkerAlt style={{ fontSize: '11px' }} />
            {listing.proximityTag}
          </span>
          <span style={{
            ...tagStyle,
            backgroundColor: listing.condition === 'Like New' ? 'rgba(34, 197, 94, 0.15)' :
                             listing.condition === 'Good' ? 'rgba(234, 179, 8, 0.15)' :
                             'rgba(204, 0, 0, 0.15)',
            color: listing.condition === 'Like New' ? '#22c55e' :
                   listing.condition === 'Good' ? '#eab308' :
                   '#CC0000',
          }}>
            {listing.condition}
          </span>
        </div>

        <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>Posted {listing.postedDate}</p>
      </div>

      {/* Right side price + actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
        <p style={{ color: '#CC0000', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>${listing.price}</p>

        {listing.status === 'available' && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              // onClick will navigate to edit listing page — to be connected later
              onClick={() => console.log('Edit listing — connect to backend later')}
              style={{
                padding: '8px 14px',
                backgroundColor: 'transparent',
                color: '#aaaaaa',
                border: '1px solid #444',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaEdit /> Edit
            </button>
            <button
              // onClick will call DELETE /api/v1/listings/:id — to be connected later
              onClick={() => console.log('Delete listing — connect to backend later')}
              style={{
                padding: '8px 14px',
                backgroundColor: 'rgba(204, 0, 0, 0.15)',
                color: '#CC0000',
                border: '1px solid rgba(204, 0, 0, 0.4)',
                borderRadius: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FaTrash /> Delete
            </button>
          </div>
        )}

        {listing.status === 'sold' && (
          <span style={{
            backgroundColor: 'rgba(204, 0, 0, 0.15)',
            color: '#CC0000',
            border: '1px solid rgba(204, 0, 0, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '13px',
          }}>
            Sold
          </span>
        )}
      </div>

    </div>
  )
}

const tagStyle = {
  backgroundColor: '#3a3a3a',
  color: '#aaaaaa',
  padding: '4px 12px',
  borderRadius: '20px',
  fontSize: '13px',
}