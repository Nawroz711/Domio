import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DEFAULT_CENTER = [34.5553, 69.2075]

// Map click handler component
function MapClickHandler({ onMapClick, setMarkerPosition }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      setMarkerPosition([lat, lng])
      onMapClick(lat.toFixed(6), lng.toFixed(6))
    },
  })
  return null
}

const LocationPicker = ({ formData, onChange, onGetCurrentLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(null)
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER)
  const mapRef = useRef(null)

  useEffect(() => {
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude)
      const lng = parseFloat(formData.longitude)
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerPosition([lat, lng])
        setMapCenter([lat, lng])
      }
    }
  }, [formData.latitude, formData.longitude])

  return (
    <div className="h-96 w-full">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution="Google Maps"
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
        />
        <MapClickHandler
          onMapClick={onChange}
          setMarkerPosition={setMarkerPosition}
        />
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>
    </div>
  )
}

export default LocationPicker