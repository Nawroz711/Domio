import Property from '../models/property.model.js'

export const getProperties = async (page, limit, filters = {}) => {
  try {
    const {
      search,
      province,
      propertyType,
      listingType,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
      bedrooms,
      isActive,
      isFeatured,
      isVerified,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters

    // Build query object
    const query = {}

    // Search functionality
    if (search) {
      query.$text = { $search: search }
    }

    // Province filter
    if (province) {
      query.province = province
    }

    // Property type filter
    if (propertyType) {
      query.propertyType = propertyType
    }

    // Listing type filter
    if (listingType) {
      query.listingType = listingType
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {}
      if (minPrice !== undefined) query.price.$gte = minPrice
      if (maxPrice !== undefined) query.price.$lte = maxPrice
    }

    // Area range filter
    if (minArea !== undefined || maxArea !== undefined) {
      query.area = {}
      if (minArea !== undefined) query.area.$gte = minArea
      if (maxArea !== undefined) query.area.$lte = maxArea
    }

    // Bedrooms filter
    if (bedrooms !== undefined && bedrooms !== '') {
      query.bedrooms = { $gte: parseInt(bedrooms) }
    }

    // Status filters
    if (isActive !== undefined && isActive !== '') {
      query.isActive = isActive === 'true'
    }

    if (isFeatured !== undefined && isFeatured !== '') {
      query.isFeatured = isFeatured === 'true'
    }

    if (isVerified !== undefined && isVerified !== '') {
      query.isVerified = isVerified === 'true'
    }

    // Sort options
    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const options = {
      page,
      limit,
      sort: sortOptions,
      populate: [
        { path: 'createdBy', select: 'name email phone' },
        { path: 'agent', select: 'name email phone' },
      ],
    }

    const properties = await Property.paginate(query, options)
    return properties
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getPropertyById = async (propertyId) => {
  try {
    const property = await Property.findById(propertyId)
      .populate('createdBy', 'name email phone avatar')
      .populate('agent', 'name email phone avatar')
    
    if (!property) {
      return null
    }

    // Increment view count
    property.views += 1
    await property.save()

    return property
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const createProperty = async (propertyData) => {
  try {
    const property = await Property.create(propertyData)
    await property.populate('createdBy', 'name email phone')
    return property
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const updateProperty = async (propertyId, updateData) => {
  try {
    const property = await Property.findByIdAndUpdate(
      propertyId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('createdBy', 'name email phone')
      .populate('agent', 'name email phone')
    
    if (!property) {
      return null
    }

    return property
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const deleteProperty = async (propertyId) => {
  try {
    const property = await Property.findByIdAndDelete(propertyId)
    
    if (!property) {
      return null
    }

    return property
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getPropertiesByUser = async (userId, page, limit) => {
  try {
    const options = {
      page,
      limit,
      sort: { createdAt: -1 },
      populate: [
        { path: 'createdBy', select: 'name email phone' },
      ],
    }

    const properties = await Property.paginate(
      { createdBy: userId },
      options
    )
    return properties
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getFeaturedProperties = async (limit = 6) => {
  try {
    const properties = await Property.find({ isFeatured: true, isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('createdBy', 'name email phone')
    
    return properties
  } catch (e) {
    console.error(e)
    throw e
  }
}

export const getPropertyStats = async () => {
  try {
    const totalProperties = await Property.countDocuments()
    const activeProperties = await Property.countDocuments({ isActive: true })
    const inactiveProperties = totalProperties - activeProperties
    const verifiedProperties = await Property.countDocuments({ isVerified: true })
    const featuredProperties = await Property.countDocuments({ isFeatured: true })
    
    // Group by property type
    const byType = await Property.aggregate([
      { $group: { _id: '$propertyType', count: { $sum: 1 } } }
    ])
    
    // Group by listing type
    const byListingType = await Property.aggregate([
      { $group: { _id: '$listingType', count: { $sum: 1 } } }
    ])
    
    // Group by province
    const byProvince = await Property.aggregate([
      { $group: { _id: '$province', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])

    return {
      totalProperties,
      activeProperties,
      inactiveProperties,
      verifiedProperties,
      featuredProperties,
      byType,
      byListingType,
      byProvince,
    }
  } catch (e) {
    console.error(e)
    throw e
  }
}