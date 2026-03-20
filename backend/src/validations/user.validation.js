import { body } from 'express-validator'

// Afghanistan phone number regex: +937xxxxxxxx or 07xxxxxxxx (9-10 digits starting with 7 after 0)
const afghanPhoneRegex = /^(\+937|07)\d{8}$/

export const createUserValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[^0-9]*$/)
    .withMessage('Name must not contain numbers'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(afghanPhoneRegex)
    .withMessage('Phone must be a valid Afghanistan phone number (e.g., +937xxxxxxxx or 07xxxxxxxx)'),
]

export const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[^0-9]*$/)
    .withMessage('Name must not contain numbers'),
  body('phone')
    .optional()
    .trim()
    .matches(afghanPhoneRegex)
    .withMessage('Phone must be a valid Afghanistan phone number (e.g., +937xxxxxxxx or 07xxxxxxxx)'),
  body('address')
    .optional()
    .trim()
    .isString()
    .withMessage('Address must be a string'),
]

export const signInValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Email must be valid'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
]
