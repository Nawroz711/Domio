import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axiosClient from '../../lib/axiosClient'
import { toast } from 'react-toastify'
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Home, Bed, Bath, Square } from 'lucide-react'

const View = () => {
  const { propertyId } = useParams()
  const navigate = useNavigate()
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
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">Loading property...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center">Property not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/admin/properties')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-2"
          >
            <ArrowLeft size={16} className="mr-1" /> Back to Properties
          </button>
          <h4 className="text-xl font-bold text-gray-800">{property.title}</h4>
          <p className="text-gray-600 text-sm flex items-center">
            <MapPin size={16} className="mr-1" />
            {property.address}, {property.district}, {property.province}
          </p>
        </div>
        <button
          onClick={() => navigate(`/admin/properties/${property._id}/edit`)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:brightness-95"
        >
          <Edit size={16} className="mr-2" /> Edit Property
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h5 className="text-lg font-semibold mb-4">Images</h5>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {property.images?.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${image}`}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h5 className="text-lg font-semibold mb-4">Property Details</h5>
            <div className="space-y-3">
              <div className="flex items-center">
                <Home size={16} className="mr-2 text-gray-500" />
                <span className="text-sm">
                  {property.propertyType} • {property.listingType}
                </span>
              </div>
              <div className="flex items-center">
                <DollarSign size={16} className="mr-2 text-gray-500" />
                <span className="text-sm">${property.price?.toLocaleString()}</span>
              </div>
              <div className="flex items-center">
                <Square size={16} className="mr-2 text-gray-500" />
                <span className="text-sm">{property.area} sq m</span>
              </div>
              {property.bedrooms > 0 && (
                <div className="flex items-center">
                  <Bed size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm">{property.bedrooms} bedrooms</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="flex items-center">
                  <Bath size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm">{property.bathrooms} bathrooms</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar size={16} className="mr-2 text-gray-500" />
                <span className="text-sm">
                  Built {property.yearBuilt || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Agent Info */}
          {property.agent && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h5 className="text-lg font-semibold mb-4">Agent</h5>
              <div className="flex items-center">
                <img
                  src={property.agent.avatar || '/default-avatar.png'}
                  alt={property.agent.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <p className="font-medium">{property.agent.name}</p>
                  <p className="text-sm text-gray-600">{property.agent.email}</p>
                  <p className="text-sm text-gray-600">{property.agent.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h5 className="text-lg font-semibold mb-4">Status</h5>
            <div className="flex items-center justify-between">
              <span className="text-sm">Active</span>
              <span className={`px-2 py-1 rounded text-xs ${property.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {property.isActive ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">Featured</span>
              <span className={`px-2 py-1 rounded text-xs ${property.isFeatured ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                {property.isFeatured ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">Verified</span>
              <span className={`px-2 py-1 rounded text-xs ${property.isVerified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {property.isVerified ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h5 className="text-lg font-semibold mb-4">Description</h5>
        <p className="text-gray-700">{property.description}</p>
      </div>

      {/* Features */}
      {property.features && property.features.length > 0 && (
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h5 className="text-lg font-semibold mb-4">Features</h5>
          <div className="flex flex-wrap gap-2">
            {property.features.map((feature, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default View