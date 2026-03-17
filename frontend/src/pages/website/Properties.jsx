import { useState, useEffect } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { MapPin, Search, Grid, List } from 'lucide-react'

const properties = [
  {
    id: 1,
    title: 'Modern Apartment in Shahr-e Naw',
    type: 'Apartment',
    listingType: 'sale',
    location: 'Kabul, Shahr-e Naw',
    price: '$45,000',
    beds: 2,
    baths: 2,
    area: '120 sqm',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'Family Home in Kart-e Char',
    type: 'Home',
    listingType: 'sale',
    location: 'Kabul, Kart-e Char',
    price: '$120,000',
    beds: 4,
    baths: 3,
    area: '250 sqm',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Commercial Shop in Macro Rayon',
    type: 'Shop',
    listingType: 'rent',
    location: 'Kabul, Macro Rayon',
    price: '$850/month',
    beds: 0,
    baths: 1,
    area: '80 sqm',
    image: 'https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    title: 'Luxury Villa in Darul Aman',
    type: 'Home',
    listingType: 'mortgage',
    location: 'Kabul, Darul Aman',
    price: '$250,000',
    beds: 5,
    baths: 4,
    area: '400 sqm',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    title: 'Cozy Studio in Deh Afghanan',
    type: 'Apartment',
    listingType: 'rent',
    location: 'Kabul, Deh Afghanan',
    price: '$280/month',
    beds: 1,
    baths: 1,
    area: '65 sqm',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    title: 'Spacious Shop in Great Pul',
    type: 'Shop',
    listingType: 'sale',
    location: 'Kabul, Great Pul',
    price: '$65,000',
    beds: 0,
    baths: 1,
    area: '60 sqm',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=400&h=300&fit=crop',
  },
  {
    id: 7,
    title: 'Penthouse with City Views',
    type: 'Apartment',
    listingType: 'sale',
    location: 'Kabul, Wazir Akbar Khan',
    price: '$180,000',
    beds: 3,
    baths: 3,
    area: '200 sqm',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop',
  },
  {
    id: 8,
    title: 'Traditional House in Paghwar',
    type: 'Home',
    listingType: 'mortgage',
    location: 'Kabul, Paghwar',
    price: '$95,000',
    beds: 3,
    baths: 2,
    area: '180 sqm',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop',
  },
]

const propertyTypes = ['All', 'Apartment', 'Home', 'Shop']

export default function PropertiesPage() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [selectedType, setSelectedType] = useState('All')
  
  // Get listing type from query params (sale, rent, mortgage)
  const listingType = searchParams.get('sale') ? 'sale' : 
                      searchParams.get('rent') ? 'rent' : 
                      searchParams.get('mortgage') ? 'mortgage' : null

  // Determine type from URL path
  const pathType = location.pathname.includes('/apartments') ? 'Apartment' 
    : location.pathname.includes('/homes') ? 'Home' 
    : location.pathname.includes('/shops') ? 'Shop' 
    : 'All'

  const currentType = selectedType === 'All' && pathType !== 'All' ? pathType : selectedType

  // Filter properties based on type and listing type
  let filteredProperties = currentType === 'All' 
    ? properties 
    : properties.filter(p => p.type === currentType)

  // Filter by listing type if present in URL
  if (listingType) {
    filteredProperties = filteredProperties.filter(p => p.listingType === listingType)
  }

  const getListingLabel = () => {
    if (!listingType) return currentType === 'All' ? 'All Properties' : `${currentType}s`
    const label = listingType.charAt(0).toUpperCase() + listingType.slice(1)
    return `${label} ${currentType === 'All' ? 'Properties' : currentType + 's'}`
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-primary py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {getListingLabel()}
          </h1>
          <p className="text-gray-300">
            {listingType 
              ? `Browse ${listingType} properties` 
              : `Explore our collection of premium ${currentType === 'All' ? 'properties' : currentType.toLowerCase() + 's'}`}
          </p>
        </div>
      </div>

      {/* Filters & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Property Type Filter */}
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <Link
                  key={type}
                  to={type === 'All' ? '/properties' : `/properties/${type.toLowerCase()}`}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentType === type
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </Link>
              ))}
            </div>

            {/* View Toggle & Search */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' 
            : 'space-y-4'
          }>
            {filteredProperties.map((property) => (
              <div 
                key={property.id} 
                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''}`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-72 flex-shrink-0' : 'h-48'}`}>
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                    {property.type}
                  </div>
                  <div className="absolute top-3 right-3 bg-accent text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                    {property.listingType}
                  </div>
                </div>
                <div className="p-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{property.title}</h3>
                  <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.location}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {property.beds > 0 && <span>{property.beds} Beds</span>}
                    {property.baths > 0 && <span>{property.baths} Baths</span>}
                    <span>{property.area}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">{property.price}</span>
                    <button className="text-primary hover:text-primary-700 font-medium text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No properties found in this category.</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              3
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
