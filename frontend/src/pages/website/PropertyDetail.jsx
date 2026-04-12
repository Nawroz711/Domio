import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axiosClient from '../../lib/axiosClient'
import { toast } from 'react-toastify'
import { MapPin, Calendar, DollarSign, Home, Bed, Bath, Square, Phone, Mail, User } from 'lucide-react'

const PropertyDetail = () => {
  const { propertyId } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosClient.get(`/properties/${propertyId}`)
        setProperty(response.data.data || response.data)
      } catch (error) {
        toast.error('Failed to load property')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (propertyId) {
      fetchProperty()
    }
  }, [propertyId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading property...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Property not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Images */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
                {property.images?.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000${image}`}
                    alt={`Property ${index + 1}`}
                    className={`w-full object-cover rounded-lg ${
                      index === 0 ? 'md:col-span-2 h-96' : 'h-48'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <p className="text-gray-600 flex items-center">
                    <MapPin size={16} className="mr-1" />
                    {property.address}, {property.district}, {property.province}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">${property.price?.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">{property.listingType}</p>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {property.bedrooms > 0 && (
                  <div className="flex items-center">
                    <Bed size={20} className="mr-2 text-gray-500" />
                    <span>{property.bedrooms} Beds</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center">
                    <Bath size={20} className="mr-2 text-gray-500" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Square size={20} className="mr-2 text-gray-500" />
                  <span>{property.area} sq m</span>
                </div>
                <div className="flex items-center">
                  <Home size={20} className="mr-2 text-gray-500" />
                  <span>{property.propertyType}</span>
                </div>
              </div>

              {/* Description */}
              <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            {property.agent && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={property.agent.avatar || '/default-avatar.png'}
                    alt={property.agent.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{property.agent.name}</p>
                    <p className="text-gray-500 text-sm">Real Estate Agent</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:brightness-95">
                    <Phone size={16} className="mr-2" />
                    {property.agent.phone}
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white">
                    <Mail size={16} className="mr-2" />
                    Email Agent
                  </button>
                </div>
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing Type</span>
                  <span className="font-medium capitalize">{property.listingType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year Built</span>
                  <span className="font-medium">{property.yearBuilt || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Floors</span>
                  <span className="font-medium">{property.floors}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`font-medium ${property.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {property.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {property.isFeatured && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Featured</span>
                    <span className="font-medium text-blue-600">Yes</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetail