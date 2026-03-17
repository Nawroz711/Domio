import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { ChevronRight, Crosshair, MapPin } from 'lucide-react'
import Sidebar from '../../components/sidebar/Sidebar'
import TopNav from '../../components/TopNav'

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom location marker with MapPin icon and radar effect
const createLocationIcon = () => {
  return L.divIcon({
    className: 'custom-location-marker',
    html: `
      <div class="location-marker-container">
        <div class="radar-pulse"></div>
        <div class="radar-pulse radar-pulse-2"></div>
        <div class="marker-center">
          <MapPin />
        </div>
      </div>
      <style>
        .location-marker-container {
          position: relative;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .marker-center {
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50% 50% 50% 50%;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(34, 197, 94, 0.5);
          border: 1.5px solid white;
          z-index: 2;
        }
        .marker-center svg {
          transform: rotate(45deg);
        }
        .radar-pulse {
          position: absolute;
          width: 40px;
          height: 40px;
          background: rgba(34, 197, 94, 0.3);
          border-radius: 50%;
          animation: radar-pulse 2s ease-out infinite;
          z-index: 1;
        }
        .radar-pulse-2 {
          animation-delay: 1s;
        }
        @keyframes radar-pulse {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  })
}

const locationIcon = createLocationIcon()

// Component to handle location updates
function LocationUpdater({ center }) {
  const map = useMap()
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom())
    }
  }, [center, map])
  
  return null
}

// Custom Zoom and Location Control
function CustomZoomLocationControl({ onLocate }) {
  const map = useMap()
  
  const handleZoomIn = () => {
    map.zoomIn()
  }
  
  const handleZoomOut = () => {
    map.zoomOut()
  }
  
  const handleLocate = () => {
    onLocate()
  }
  
  return (
    <div className="leaflet-bottom leaflet-right mb-4">
      <div className="leaflet-control leaflet-control-custom bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
        <button 
          onClick={handleZoomIn}
          className="p-3 hover:bg-gray-100 transition-colors border-b border-gray-200 cursor-pointer"
          title="Zoom In"
        >
          <span className="text-lg font-bold text-gray-700">+</span>
        </button>
        <button 
          onClick={handleZoomOut}
          className="p-3 hover:bg-gray-100 transition-colors border-b border-gray-200 cursor-pointer"
          title="Zoom Out"
        >
          <span className="text-lg font-bold text-gray-700">−</span>
        </button>
        <button 
          onClick={handleLocate}
          className="p-3 hover:bg-gray-100 transition-colors cursor-pointer"
          title="My Location"
        >
          <MapPin className="w-5 h-5 text-green-600" />
        </button>
      </div>
    </div>
  )
}

export default function MapPage() {
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isLocating, setIsLocating] = useState(true)
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false)

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude]
          setLocation(newLocation)
          setLocationError(null)
          setIsLocating(false)
        },
        (error) => {
          console.log('Error getting location:', error.message)
          setLocationError(error.message)
          setIsLocating(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation is not supported by this browser')
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation([position.coords.latitude, position.coords.longitude])
          setIsLocating(false)
        },
        (error) => {
          console.log('Error getting location:', error.message)
          setLocationError(error.message)
          setLocation([51.505, -0.09])
          setIsLocating(false)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    } else {
      setLocationError('Geolocation is not supported by this browser')
      setLocation([51.505, -0.09])
      setIsLocating(false)
    }
  }, [])

  const center = location || [51.505, -0.09]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Left Sidebar - Separate Component */}
      <Sidebar isOpen={leftSidebarOpen} onToggle={() => setLeftSidebarOpen(!leftSidebarOpen)} />

      {/* Map Section */}
      <div className="flex-1 h-full relative">
        <MapContainer
          center={center}
          zoom={15}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          <Marker position={center} icon={locationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">{isLocating ? 'Locating...' : 'Your Location'}</p>
              </div>
            </Popup>
          </Marker>
          <LocationUpdater center={center} />
          
          {/* Custom Zoom and Location Control - Bottom Right */}
          <CustomZoomLocationControl onLocate={getCurrentLocation} />
        </MapContainer>

        <TopNav />
      </div>
    </div>
  )
}
