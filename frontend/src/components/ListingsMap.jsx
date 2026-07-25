import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default marker icon issue with leaflet + vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Coordinates for each proximity tag
const locationCoordinates = {
  'Keele Campus':    { lat: 43.7735, lng: -79.5019 },
  'Glendon Campus':  { lat: 43.7360, lng: -79.3758 },
  'York Lanes':      { lat: 43.7738, lng: -79.5023 },
  'The Village':     { lat: 43.7745, lng: -79.4998 },
}

export default function ListingsMap({ listings }) {
  // Filter listings that have a known location
  const mappedListings = listings.filter(l => locationCoordinates[l.location])

  return (
    <MapContainer
      center={[43.7735, -79.5019]}
      zoom={14}
      style={{ height: '400px', width: '100%', borderRadius: '14px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mappedListings.map(listing => (
        <Marker
          key={listing.id}
          position={[
            locationCoordinates[listing.location].lat,
            locationCoordinates[listing.location].lng,
          ]}
        >
          <Popup>
            <div style={{ minWidth: '150px' }}>
              <strong>{listing.title}</strong>
              <br />
              <span style={{ color: '#CC0000' }}>${listing.price}</span>
              <br />
              <span style={{ fontSize: '12px', color: '#666' }}>{listing.condition}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}