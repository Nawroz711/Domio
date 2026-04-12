import { useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../lib/axiosClient'

const initialFormData = {
  title: '',
  description: '',
  propertyType: 'house',
  listingType: 'sale',
  price: '',
  area: '',
  bedrooms: '',
  bathrooms: '',
  floors: '1',
  yearBuilt: '',
  address: '',
  province: '',
  city: '',
  district: '',
  latitude: '',
  longitude: '',
  features: [],
  images: [],
}

export function useProperty(mode = 'create', propertyId = null) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState([])
  const [previewImages, setPreviewImages] = useState([])
  const [coordinates, setCoordinates] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Load property data for edit mode
  useEffect(() => {
    if (mode === 'edit' && propertyId) {
      const loadProperty = async () => {
        setLoading(true)
        try {
          const response = await axiosClient.get(`/properties/${propertyId}`)
          const property = response.data.data || response.data
          setFormData({
            title: property.title || '',
            description: property.description || '',
            propertyType: property.propertyType || 'house',
            listingType: property.listingType || 'sale',
            price: property.price?.toString() || '',
            area: property.area?.toString() || '',
            bedrooms: property.bedrooms?.toString() || '',
            bathrooms: property.bathrooms?.toString() || '',
            floors: property.floors?.toString() || '1',
            yearBuilt: property.yearBuilt?.toString() || '',
            address: property.address || '',
            province: property.province || '',
            city: property.city || '',
            district: property.district || '',
            latitude: property.latitude?.toString() || '',
            longitude: property.longitude?.toString() || '',
            features: property.features || [],
            images: property.images || [],
          })
          // Set preview images for existing images
          const existingPreviews = (property.images || []).map((url) => ({
            preview: `http://localhost:5000${url}`,
            name: url.split('/').pop(),
            existing: true,
          }))
          setPreviewImages(existingPreviews)
        } catch (error) {
          toast.error('Failed to load property data')
          console.error(error)
        } finally {
          setLoading(false)
        }
      }
      loadProperty()
    }
  }, [mode, propertyId])

  const handleChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const setFormDataValue = useCallback((data) => {
    setFormData(data)
  }, [])

  const handleFeatureChange = useCallback((featureId) => {
    setFormData((prev) => {
      const features = prev.features.includes(featureId)
        ? prev.features.filter((f) => f !== featureId)
        : [...prev.features, featureId]
      return { ...prev, features }
    })
  }, [])

  const handleCoordinatesChange = useCallback((lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }))
    setCoordinates({ lat, lng })
  }, [])

  const setCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          handleCoordinatesChange(latitude.toFixed(6), longitude.toFixed(6))
          toast.success('Location obtained successfully')
        },
        (error) => {
          console.error('Geolocation error:', error)
          toast.error('Unable to get current location. Please check your browser permissions.')
        }
      )
    } else {
      toast.error('Geolocation is not supported by your browser')
    }
  }, [handleCoordinatesChange])

  const handleImageUpload = useCallback(async (files) => {
    if (!files || files.length === 0) return

    if (files.length > 10) {
      toast.error('Maximum 10 images allowed')
      return
    }

    // Create preview URLs
    const newPreviewImages = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }))

    setPreviewImages((prev) => [...prev, ...newPreviewImages])
  }, [])

  const removeImage = useCallback((index) => {
    setPreviewImages((prev) => {
      const newImages = [...prev]
      const removed = newImages[index]
      if (removed?.preview && !removed.existing) {
        URL.revokeObjectURL(removed.preview)
      }
      newImages.splice(index, 1)
      return newImages
    })
  }, [])

  const uploadImages = useCallback(async () => {
    const files = previewImages.map((img) => img.file).filter(Boolean)
    if (files.length === 0) return []

    setIsUploading(true)
    try {
      const formDataUpload = new FormData()
      files.forEach((file) => {
        formDataUpload.append('images', file)
      })

      const response = await axiosClient.post('/properties/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const uploadedUrls = response?.data?.data?.images || []
      setImages(uploadedUrls)
      return uploadedUrls
    } catch (error) {
      const message = error?.response?.data?.message || 'Failed to upload images'
      toast.error(message)
      throw error
    } finally {
      setIsUploading(false)
    }
  }, [previewImages])

  const validate = useCallback(() => {
    if (!formData.title?.trim()) {
      return 'Title is required'
    }
    if (formData.title.trim().length < 5) {
      return 'Title must be at least 5 characters'
    }
    if (!formData.description?.trim()) {
      return 'Description is required'
    }
    if (formData.description.trim().length < 10) {
      return 'Description must be at least 10 characters'
    }
    if (!formData.propertyType) {
      return 'Property type is required'
    }
    if (!formData.listingType) {
      return 'Listing type is required'
    }
    if (!formData.price || Number(formData.price) <= 0) {
      return 'Price is required and must be positive'
    }
    if (!formData.area || Number(formData.area) <= 0) {
      return 'Area is required and must be positive'
    }
    if (!formData.province) {
      return 'Province is required'
    }
    if (previewImages.length === 0) {
      return 'At least one image is required'
    }
    return ''
  }, [formData, previewImages])

  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault()
    const validationError = validate()

    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      // First upload new images if any
      let uploadedImageUrls = []
      const newImages = previewImages.filter(img => !img.existing)
      if (newImages.length > 0) {
        const files = newImages.map(img => img.file).filter(Boolean)
        if (files.length > 0) {
          const formDataUpload = new FormData()
          files.forEach((file) => {
            formDataUpload.append('images', file)
          })
          const response = await axiosClient.post('/properties/upload', formDataUpload, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          uploadedImageUrls = response?.data?.data?.images || []
        }
      }

      // Combine existing and new images
      const existingImages = previewImages.filter(img => img.existing).map(img => img.preview)
      const allImages = [...existingImages, ...uploadedImageUrls]

      // Build payload with proper types
      const payload = {
        title: formData.title?.trim(),
        description: formData.description?.trim(),
        propertyType: formData.propertyType,
        listingType: formData.listingType,
        price: Number(formData.price) || 0,
        area: Number(formData.area) || 0,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : 0,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : 0,
        floors: formData.floors ? parseInt(formData.floors, 10) : 1,
        yearBuilt: formData.yearBuilt ? parseInt(formData.yearBuilt, 10) : undefined,
        address: formData.address?.trim() || '',
        province: formData.province,
        city: formData.city?.trim() || '',
        district: formData.district?.trim() || '',
        latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
        longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
        features: formData.features || [],
        images: allImages,
      }

      console.log('Submitting payload:', payload)

      let response
      if (mode === 'edit' && propertyId) {
        response = await axiosClient.put(`/properties/${propertyId}`, payload)
        if (response.status === 200) {
          toast.success('Property updated successfully!')
        }
      } else {
        response = await axiosClient.post('/properties', payload)
        if (response.status === 201) {
          toast.success('Property created successfully!')
        }
      }

      navigate('/admin/properties/homes')
    } catch (error) {
      const errorData = error?.response?.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err) => {
          toast.error(err.message)
        })
      } else {
        toast.error(errorData?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} property. Please try again.`)
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, previewImages, validate, navigate, mode, propertyId])

  const resetForm = useCallback(() => {
    setFormData(initialFormData)
    setImages([])
    setPreviewImages((prev) => {
      prev.forEach((img) => {
        if (img?.preview) URL.revokeObjectURL(img.preview)
      })
      return []
    })
    setCoordinates(null)
  }, [])

  return {
    formData,
    images,
    previewImages,
    coordinates,
    isSubmitting,
    isUploading,
    loading,
    handleChange,
    handleFeatureChange,
    handleCoordinatesChange,
    setCurrentLocation,
    handleImageUpload,
    removeImage,
    uploadImages,
    validate,
    handleSubmit,
    resetForm,
    setFormData: setFormDataValue,
  }
}