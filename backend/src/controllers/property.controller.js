import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertiesByUser,
  getFeaturedProperties,
  getPropertyStats,
} from '../services/properties.services.js'
import { processPropertyImages } from '../middlewares/upload.middleware.js'
import PropertyImage from '../models/propertyImage.model.js'
import path from 'path'
import fs from 'fs'

// Get all properties with filters
export const properties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const filters = {
      search: req.query.search || '',
      province: req.query.province || '',
      propertyType: req.query.propertyType || '',
      listingType: req.query.listingType || '',
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : undefined,
      minArea: req.query.minArea ? parseFloat(req.query.minArea) : undefined,
      maxArea: req.query.maxArea ? parseFloat(req.query.maxArea) : undefined,
      bedrooms: req.query.bedrooms || '',
      isActive: req.query.isActive || '',
      isFeatured: req.query.isFeatured || '',
      isVerified: req.query.isVerified || '',
      sortBy: req.query.sortBy || 'createdAt',
      sortOrder: req.query.sortOrder || 'desc',
    }

    const properties = await getProperties(page, limit, filters)

    if (!properties) {
      return res.status(404).json({ message: 'Properties not found' })
    }

    return res.status(200).json(properties)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to fetch properties', error: e.message })
  }
}

// Get a single property by ID
export const property = async (req, res) => {
  try {
    const { propertyId } = req.params
    const property = await getPropertyById(propertyId)

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.status(200).json({ data: property })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to fetch property', error: e.message })
  }
}

// Create a new property
export const createNewProperty = async (req, res) => {
  try {
    const userId = req.get('x-user-id')

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' })
    }

    const { images, ...propertyData } = req.body

    const property = await createProperty({
      ...propertyData,
      createdBy: userId,
      agent: userId,
    })

    // Save images to PropertyImage collection
    if (images && images.length > 0) {
      const imageDocs = images.map((imageUrl, index) => ({
        propertyId: property._id,
        imageUrl,
        isPrimary: index === 0,
        order: index,
      }))
      await PropertyImage.insertMany(imageDocs)
    }

    return res.status(201).json({
      message: 'Property created successfully',
      data: property,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to create property', error: e.message })
  }
}

// Update a property
export const updatePropertyDetails = async (req, res) => {
  try {
    const { propertyId } = req.params
    const userId = req.get('x-user-id')

    // Get the existing property
    const existingProperty = await getPropertyById(propertyId)
    
    if (!existingProperty) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check if user is the owner or admin
    const userIdStr = userId?.toString()
    const createdByIdStr = existingProperty.createdBy?._id?.toString?.() || existingProperty.createdBy?.toString?.()

    if (createdByIdStr && userIdStr && createdByIdStr !== userIdStr) {
      // In a real app, you'd check for admin role here
      return res.status(403).json({ message: 'You are not authorized to update this property' })
    }

    const property = await updateProperty(propertyId, req.body)

    return res.status(200).json({
      message: 'Property updated successfully',
      data: property,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to update property', error: e.message })
  }
}

// Delete a property
export const deletePropertyById = async (req, res) => {
  try {
    const { propertyId } = req.params
    const userId = req.get('x-user-id')

    // Get the existing property
    const existingProperty = await getPropertyById(propertyId)
    
    if (!existingProperty) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Check if user is the owner or admin
    const userIdStr = userId?.toString()
    const createdByIdStr = existingProperty.createdBy?._id?.toString?.() || existingProperty.createdBy?.toString?.()

    if (createdByIdStr && userIdStr && createdByIdStr !== userIdStr) {
      return res.status(403).json({ message: 'You are not authorized to delete this property' })
    }

    await deleteProperty(propertyId)

    return res.status(200).json({ message: 'Property deleted successfully' })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to delete property', error: e.message })
  }
}

// Get properties by current user
export const myProperties = async (req, res) => {
  try {
    const userId = req.get('x-user-id')

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' })
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10

    const properties = await getPropertiesByUser(userId, page, limit)

    if (!properties) {
      return res.status(404).json({ message: 'Properties not found' })
    }

    return res.status(200).json(properties)
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to fetch properties', error: e.message })
  }
}

// Get featured properties
export const featuredProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6
    const properties = await getFeaturedProperties(limit)

    return res.status(200).json({ data: properties })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to fetch featured properties', error: e.message })
  }
}

// Get property statistics (admin)
export const propertyStats = async (req, res) => {
  try {
    const stats = await getPropertyStats()
    return res.status(200).json({ data: stats })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to fetch property statistics', error: e.message })
  }
}

// Toggle property status (active/inactive)
export const togglePropertyStatus = async (req, res) => {
  try {
    const { propertyId } = req.params
    const { isActive } = req.body

    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive status is required' })
    }

    const property = await updateProperty(propertyId, { isActive })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.status(200).json({
      message: `Property ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: property,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to update property status', error: e.message })
  }
}

// Upload property images
export const uploadPropertyImagesHandler = async (req, res) => {
  try {
    const userId = req.get('x-user-id')
    const { propertyId } = req.params

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID not found' })
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    // Validate file count
    if (req.files.length > 10) {
      return res.status(400).json({ message: 'Maximum 10 files allowed' })
    }

    // Process images with Sharp
    const imageUrls = await processPropertyImages(req.files)

    // If propertyId is provided, update the property with images
    if (propertyId) {
      const existingProperty = await getPropertyById(propertyId)
      if (!existingProperty) {
        // Delete uploaded files if property not found
        for (const url of imageUrls) {
          try {
            const fullPath = path.join(process.cwd(), url)
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath)
            }
          } catch { /* ignore */ }
        }
        return res.status(404).json({ message: 'Property not found' })
      }

      // Check ownership
      const userIdStr = userId?.toString()
      const createdByIdStr = existingProperty.createdBy?._id?.toString?.() || existingProperty.createdBy?.toString?.()
      if (createdByIdStr && userIdStr && createdByIdStr !== userIdStr) {
        // Delete uploaded files
        for (const url of imageUrls) {
          try {
            const fullPath = path.join(process.cwd(), url)
            if (fs.existsSync(fullPath)) {
              fs.unlinkSync(fullPath)
            }
          } catch { /* ignore */ }
        }
        return res.status(403).json({ message: 'You are not authorized to update this property' })
      }

      // Add new images to existing ones
      const existingImages = existingProperty.images || []
      const allImages = [...existingImages, ...imageUrls]
      await updateProperty(propertyId, { images: allImages })

      return res.status(200).json({
        message: 'Images uploaded successfully',
        data: { images: allImages },
      })
    }

    // Return just the uploaded image URLs if no propertyId
    return res.status(200).json({
      message: 'Images uploaded successfully',
      data: { images: imageUrls },
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to upload images', error: e.message })
  }
}

// Toggle property featured status
export const togglePropertyFeatured = async (req, res) => {
  try {
    const { propertyId } = req.params
    const { isFeatured } = req.body

    if (isFeatured === undefined) {
      return res.status(400).json({ message: 'isFeatured status is required' })
    }

    const property = await updateProperty(propertyId, { isFeatured })

    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.status(200).json({
      message: `Property ${isFeatured ? 'added to' : 'removed from'} featured successfully`,
      data: property,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ message: 'Failed to update property featured status', error: e.message })
  }
}