import { Router } from 'express'
import {
  properties,
  property,
  createNewProperty,
  updatePropertyDetails,
  deletePropertyById,
  myProperties,
  featuredProperties,
  propertyStats,
  togglePropertyStatus,
  togglePropertyFeatured,
  uploadPropertyImagesHandler,
} from '../controllers/property.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  createPropertyValidation,
  updatePropertyValidation,
  getPropertiesValidation,
  propertyIdValidation,
} from '../validations/property.validation.js'
import { validate } from '../middlewares/validation.middleware.js'
import { uploadPropertyImages } from '../middlewares/upload.middleware.js'

const router = Router()

// Public routes
router.get('/', getPropertiesValidation, validate, properties)
router.get('/featured', featuredProperties)
router.get('/stats', propertyStats)
router.get('/mine', authMiddleware, myProperties)
router.get('/:propertyId', propertyIdValidation, validate, property)

// Protected routes (require authentication)
router.post('/', authMiddleware, createPropertyValidation, validate, createNewProperty)
router.put('/:propertyId', authMiddleware, propertyIdValidation, updatePropertyValidation, validate, updatePropertyDetails)
router.delete('/:propertyId', authMiddleware, propertyIdValidation, validate, deletePropertyById)
router.patch('/:propertyId/status', authMiddleware, propertyIdValidation, validate, togglePropertyStatus)
router.patch('/:propertyId/featured', authMiddleware, propertyIdValidation, validate, togglePropertyFeatured)

// Image upload route
router.post('/upload', authMiddleware, uploadPropertyImages.array('images', 10), (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError.message })
  }
  next()
}, uploadPropertyImagesHandler)
router.post('/:propertyId/images', authMiddleware, propertyIdValidation, uploadPropertyImages.array('images', 10), (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError.message })
  }
  next()
}, uploadPropertyImagesHandler)

export default router