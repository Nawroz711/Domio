import { body, query, param, validationResult } from 'express-validator'

// Validation rules for creating a property
export const createPropertyValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  body('propertyType')
    .trim()
    .notEmpty()
    .withMessage('Property type is required')
    .isIn(['house', 'apartment', 'land', 'commercial', 'villa', 'building'])
    .withMessage('Invalid property type'),
  
  body('listingType')
    .trim()
    .notEmpty()
    .withMessage('Listing type is required')
    .isIn(['sale', 'rent', 'lease'])
    .withMessage('Invalid listing type'),
  
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('area')
    .notEmpty()
    .withMessage('Area is required')
    .isFloat({ min: 1 })
    .withMessage('Area must be at least 1 square meter'),
  
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  
  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a non-negative integer'),
  
  body('floors')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Floors must be at least 1'),
  
  body('yearBuilt')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 5 })
    .withMessage('Invalid year built'),
  
  body('province')
    .trim()
    .notEmpty()
    .withMessage('Province is required'),
  
  body('city')
    .optional()
    .trim(),
  
  body('district')
    .optional()
    .trim(),
  
  body('address')
    .optional()
    .trim(),
  
  body('latitude')
    .optional()
    .isFloat({ min: -90, max: 90 })
    .withMessage('Invalid latitude'),
  
  body('longitude')
    .optional()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Invalid longitude'),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
]

// Validation rules for updating a property
export const updatePropertyValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Description must be between 10 and 5000 characters'),
  
  body('propertyType')
    .optional()
    .trim()
    .isIn(['house', 'apartment', 'land', 'commercial', 'villa', 'building'])
    .withMessage('Invalid property type'),
  
  body('listingType')
    .optional()
    .trim()
    .isIn(['sale', 'rent', 'lease'])
    .withMessage('Invalid listing type'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('area')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Area must be at least 1 square meter'),
  
  body('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  
  body('bathrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bathrooms must be a non-negative integer'),
  
  body('province')
    .optional()
    .trim(),
  
  body('city')
    .optional()
    .trim(),
  
  body('district')
    .optional()
    .trim(),
  
  body('address')
    .optional()
    .trim(),
  
  body('features')
    .optional()
    .isArray()
    .withMessage('Features must be an array'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array of URLs'),
  
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean'),
  
  body('isFeatured')
    .optional()
    .isBoolean()
    .withMessage('isFeatured must be a boolean'),
]

// Validation rules for getting properties with filters
export const getPropertiesValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('search')
    .optional()
    .trim(),
  
  query('province')
    .optional()
    .trim(),
  
  query('propertyType')
    .optional()
    .trim()
    .isIn(['house', 'apartment', 'land', 'commercial', 'villa', 'building'])
    .withMessage('Invalid property type'),
  
  query('listingType')
    .optional()
    .trim()
    .isIn(['sale', 'rent', 'lease'])
    .withMessage('Invalid listing type'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Min price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Max price must be a positive number'),
  
  query('minArea')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Min area must be at least 1'),
  
  query('maxArea')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Max area must be at least 1'),
  
  query('bedrooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Bedrooms must be a non-negative integer'),
  
  query('sortBy')
    .optional()
    .trim()
    .isIn(['price', 'area', 'createdAt', 'views'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .trim()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
]

// Validation rule for property ID param
export const propertyIdValidation = [
  param('propertyId')
    .trim()
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID'),
]