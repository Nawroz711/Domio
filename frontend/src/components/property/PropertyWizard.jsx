import { useState } from 'react'
import Select from 'react-select'
import { useProperty } from '../../hooks/useProperty'
import { useNavigate } from 'react-router-dom'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
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

const listingTypes = [
  { value: 'sale', label: 'For Sale' },
  { value: 'rent', label: 'For Rent' },
  { value: 'lease', label: 'For Lease' },
]

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

const selectStyles = {
  control: (base) => ({
    ...base,
    minHeight: '42px',
    borderRadius: '0.5rem',
    border: '1px solid #d1d5db',
    cursor: 'pointer',
  }),
  input: (base) => ({ ...base, display: 'none' }),
}

const steps = [
  { id: 1, title: 'Basic Info' },
  { id: 2, title: 'Price' },
  { id: 3, title: 'Details' },
  { id: 4, title: 'Location' },
  { id: 5, title: 'Features' },
  { id: 6, title: 'Images' },
]

const PropertyWizard = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [showMap, setShowMap] = useState(false)
  const [direction, setDirection] = useState('forward')

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

  const goNext = () => {
    setDirection('forward')
    setCurrentStep((prev) => Math.min(prev + 1, steps.length))
  }

  const goPrev = () => {
    setDirection('backward')
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFinish = async (e) => {
    await handleSubmit(e)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Stepper */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  currentStep > step.id
                    ? 'bg-green-500 text-white'
                    : currentStep === step.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
              </div>
              <span
                className={`ml-2 text-sm hidden sm:inline ${
                  currentStep >= step.id ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-8 sm:w-16 h-0.5 mx-2 ${
                    currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content with Animation */}
      <div className="p-6">
        <div
          className={`transition-all duration-300 ease-in-out ${
            direction === 'forward'
              ? 'translate-x-0 opacity-100'
              : 'translate-x-0 opacity-100'
          }`}
        >
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={propertyTypes.find((t) => t.value === formData.propertyType)}
                    onChange={(opt) => setFormData({ ...formData, propertyType: opt.value })}
                    options={propertyTypes}
                    styles={selectStyles}
                    placeholder="Select"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Listing Type <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={listingTypes.find((t) => t.value === formData.listingType)}
                    onChange={(opt) => setFormData({ ...formData, listingType: opt.value })}
                    options={listingTypes}
                    styles={selectStyles}
                    placeholder="Select"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the property in detail..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Price */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Price & Area</h5>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                  <input
                    type="number"
                    name="yearBuilt"
                    value={formData.yearBuilt}
                    onChange={handleChange}
                    placeholder="e.g., 2020"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Property Details</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="0"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Location</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Province <span className="text-red-500">*</span>
                  </label>
                  <Select
                    value={provinces.find((p) => p.value === formData.province)}
                    onChange={(opt) => setFormData({ ...formData, province: opt.value })}
                    options={provinces}
                    styles={selectStyles}
                    placeholder="Select province"
                    getOptionValue={(opt) => opt.value}
                    getOptionLabel={(opt) => opt.label}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.latitude}
                    onChange={(e) => handleCoordinatesChange(e.target.value, formData.longitude)}
                    placeholder="e.g., 34.5553"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    value={formData.longitude}
                    onChange={(e) => handleCoordinatesChange(formData.latitude, e.target.value)}
                    placeholder="e.g., 69.2075"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex items-end gap-2">
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
                    Map
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Features */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Features & Amenities</h5>
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
          )}

          {/* Step 6: Images */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <h5 className="text-lg font-semibold text-gray-800 mb-4">Property Images</h5>
              <ImageUpload
                previewImages={previewImages}
                onDrop={onDrop}
                onRemove={removeImage}
                isUploading={isUploading}
              />
            </div>
          )}
        </div>
      </div>

      {/* Map Dialog */}
      {showMap && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-5xl mx-4 shadow-xl">
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
            <div className="h-[500px]">
              <LocationPicker
                formData={formData}
                onChange={handleCoordinatesChange}
                onGetCurrentLocation={setCurrentLocation}
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between px-6 py-4 border-t bg-gray-50">
        <button
          type="button"
          onClick={goPrev}
          disabled={currentStep === 1}
          className={`flex items-center px-4 py-2 rounded-lg ${
            currentStep === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Previous
        </button>

        {currentStep < steps.length ? (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center px-6 py-2 bg-primary text-white rounded-lg hover:brightness-95"
          >
            Next <ChevronRight className="w-5 h-5 ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-green-500 text-white rounded-lg hover:brightness-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Property'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PropertyWizard