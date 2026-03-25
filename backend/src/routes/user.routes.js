import { Router } from 'express'
import {
  createUser,
  deleteMyAccount,
  getMyProfile,
  signInUser,
  updateMyProfile,
  uploadAvatar,
  users,
  toggleUserStatus,
} from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { createUserValidation, signInValidation, updateProfileValidation } from '../validations/user.validation.js'
import { validate } from '../middlewares/validation.middleware.js'
import { upload } from '../middlewares/upload.middleware.js'
import { authLimiter } from '../middlewares/rateLimiter.js'

const router = Router()

router.post('/signup', authLimiter, createUserValidation, validate, createUser)
router.post('/signin', authLimiter, signInValidation, validate, signInUser)
router.get('/profile', authMiddleware, getMyProfile)
router.put('/profile', authMiddleware, updateProfileValidation, validate, updateMyProfile)
router.post('/avatar', authMiddleware, upload.single('avatar'), (req, res, next) => {
  if (req.fileValidationError) {
    return res.status(400).json({ message: req.fileValidationError.message })
  }
  next()
}, uploadAvatar)
router.delete('/profile', authMiddleware, deleteMyAccount)

// User management section routes
router.get('/' , authLimiter, users)
router.patch('/:userId/status', authMiddleware, toggleUserStatus)

export default router
