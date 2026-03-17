import { Router } from 'express'
import {
  createUser,
  deleteMyAccount,
  getMyProfile,
  signInUser,
  updateMyProfile,
} from '../controllers/user.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'
import { createUserValidation, signInValidation } from '../middlewares/user.validation.js'
import { authLimiter } from '../middlewares/rateLimiter.js'

const router = Router()

router.post('/signup', authLimiter, createUserValidation, createUser)
router.post('/signin', authLimiter, signInValidation, signInUser)
router.get('/profile', authMiddleware, getMyProfile)
router.put('/profile', authMiddleware, updateMyProfile)
router.delete('/profile', authMiddleware, deleteMyAccount)

export default router
