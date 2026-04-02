import Select from 'react-select'
import { useState } from 'react'
import { useProperty } from '../../hooks/useProperty'
import { useNavigate } from 'react-router-dom'
import LocationPicker from './LocationPicker'
import ImageUpload from './ImageUpload'
import provinces from '../../const/provinces'

// Property type options
const propertyTypes = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'building', label: 'Building' },
  { value: 'land', label: 'Land' },
  { value: 'commercial', label: 'Commercial' },
]

// Listing type options
const listingTypes = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
]

// Features
const commonFeatures = [
  { id: 'parking', label: 'Parking' },
  { id: 'garden', label: 'Garden' },
  { id: 'balcony', label: 'Balcony' },
  { id: 'pool', label: 'Pool' },
  { id: 'gym', label: 'Gym' },
  { id: 'security', label: 'Security' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'furnished', label: 'Furnished' },
  { id: 'ac', label: 'Air Conditioning' },
  { id: 'heating', label: 'Heating' },
  { id: 'water_supply', label: 'Water Supply' },
  { id: 'electricity', label: 'Electricity' },
]

// Custom styles for React Select - non-editable
const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: '42px',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
  }),
  input: (base) => ({
    ...base,
    display: 'none',
  }),
}

const PropertyForm = () => {
  const navigate = useNavigate()
  const [showMap, setShowMap] = useState(false)
  const {
    formData,
    previewImages,
    isSubmitting,
    isUploading,
    handleChange,
    handleFeatureChange,
    handleCoordinatesChange,
    setCurrentLocation,
    handleImageUpload,
    removeImage,
    handleSubmit,
    setFormData,
  } = useProperty()

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.slice(0, 10 - previewImages.length)
    if (newImages.length > 0) {
      handleImageUpload(newImages)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Basic Information */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          Basic Information
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Title - spans 2 columns */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Beautiful 3-Bedroom House in Kabul"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Property Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={propertyTypes.find((t) => t.value === formData.propertyType)}
              onChange={(option) => setFormData({ ...formData, propertyType: option.value })}
              options={propertyTypes}
              styles={selectStyles}
              placeholder="Select"
            />
          </div>

          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Listing Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={listingTypes.find((t) => t.value === formData.listingType)}
              onChange={(option) => setFormData({ ...formData, listingType: option.value })}
              options={listingTypes}
              styles={selectStyles}
              placeholder="Select"
            />
          </div>

          {/* Description - spans full width */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe the property in detail..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
        </div>
      </div>

      {/* Price & Area */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          Price & Area
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Area (sq m) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="0"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year Built
            </label>
            <input
              type="number"
              name="yearBuilt"
              value={formData.yearBuilt}
              onChange={handleChange}
              placeholder="e.g., 2020"
              min="1900"
              max={new Date().getFullYear() + 5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          Property Details
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Floors</label>
            <input
              type="number"
              name="floors"
              value={formData.floors}
              onChange={handleChange}
              placeholder="1"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Location</h5>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Province <span className="text-red-500">*</span>
            </label>
            <Select
              value={provinces.find(p => p.value === formData.province)}
              onChange={(option) => setFormData({ ...formData, province: option?.value || '' })}
              options={provinces}
              styles={selectStyles}
              placeholder="Select province"
              getOptionValue={(option) => option.value}
              getOptionLabel={(option) => option.label}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="e.g., District 1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Street address..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Coordinates - Dialog Button */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          Location Coordinates
        </h5>
        
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
            <input
              type="number"
              step="0.000001"
              value={formData.latitude}
              onChange={(e) => handleCoordinatesChange(e.target.value, formData.longitude || '0')}
              placeholder="e.g., 34.5553"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
            <input
              type="number"
              step="0.000001"
              value={formData.longitude}
              onChange={(e) => handleCoordinatesChange(formData.latitude || '0', e.target.value)}
              placeholder="e.g., 69.2075"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            type="button"
            onClick={setCurrentLocation}
            className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200"
          >
            Current
          </button>
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200"
          >
            Open Map
          </button>
        </div>
      </div>

      {/* Map Dialog */}
      {showMap && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-3xl mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Select Location</h3>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            <LocationPicker
              formData={formData}
              onChange={handleCoordinatesChange}
              onGetCurrentLocation={setCurrentLocation}
            />
          </div>
        </div>
      )}

      {/* Features */}
      <div className="mb-6">
        <h5 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">
          Features & Amenities
        </h5>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonFeatures.map((feature) => (
            <label
              key={feature.id}
              className="flex items-center cursor-pointer p-2 rounded border border-gray-200 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={formData.features.includes(feature.id)}
                onChange={() => handleFeatureChange(feature.id)}
                className="w-4 h-4 text-primary border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{feature.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Images */}
      <ImageUpload
        previewImages={previewImages}
        onDrop={onDrop}
        onRemove={removeImage}
        isUploading={isUploading}
      />

      {/* Submit */}
      <div className="flex justify-end gap-4 pt-4 border-t mt-6">
        <button
          type="button"
          onClick={() => navigate('/admin/properties')}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:brightness-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Property'}
        </button>
      </div>
    </form>
  )
}

export default PropertyForm