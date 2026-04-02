import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

let sharp = null
try {
  sharp = require('sharp')
} catch (e) {
  console.warn('Sharp not available, image processing disabled')
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Disk storage for regular files (avatars, etc.)
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, 'avatar-' + uniqueSuffix + ext)
  },
})

// Memory storage for property images (to process with Sharp)
const memoryStorage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    req.fileValidationError = 'Only image files are allowed (jpeg, jpg, png, gif, webp)'
    cb(null, false)
  }
}

// Regular upload for avatars (single file)
export const upload = multer({
  storage: diskStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})

// Property images upload (multiple files with Sharp processing)
export const uploadPropertyImages = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    files: 10, // Maximum 10 files per upload
  },
})

// Process images with Sharp - convert to AVIF format
export const processPropertyImages = async (files, propertyId = null) => {
  const processedImages = []
  
  // Create separate folder for each property
  const propertyFolder = propertyId 
    ? path.join(uploadsDir, `property-${propertyId}`)
    : path.join(uploadsDir, `temp-${Date.now()}`)
  
  if (!fs.existsSync(propertyFolder)) {
    fs.mkdirSync(propertyFolder, { recursive: true })
  }
  
  // If sharp is not available, save as original files
  if (!sharp) {
    for (const file of files) {
      try {
        const uniqueSuffix = Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        const filename = `image-${uniqueSuffix}${ext}`
        const filepath = path.join(propertyFolder, filename)
        
        // Write file directly
        fs.writeFileSync(filepath, file.buffer)
        processedImages.push(`/uploads/${path.basename(propertyFolder)}/${filename}`)
      } catch (error) {
        console.error('Error saving image:', error)
      }
    }
    return processedImages
  }

  // Process with Sharp
  for (const file of files) {
    try {
      const uniqueSuffix = Math.round(Math.random() * 1E9)
      const filename = `image-${uniqueSuffix}.avif`
      const filepath = path.join(propertyFolder, filename)

      // Process with Sharp: convert to AVIF, resize if too large
      await sharp(file.buffer)
        .resize(1920, 1080, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .avif({
          quality: 80,
          effort: 4,
        })
        .toFile(filepath)

      // Return the public URL
      processedImages.push(`/uploads/${filename}`)
    } catch (error) {
      console.error('Error processing image:', error)
      // Fallback: save as original
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const ext = path.extname(file.originalname)
        const filename = `property-${uniqueSuffix}${ext}`
        const filepath = path.join(uploadsDir, filename)
        fs.writeFileSync(filepath, file.buffer)
        processedImages.push(`/uploads/${filename}`)
      } catch (e) {
        console.error('Error saving fallback image:', e)
      }
    }
  }

  return processedImages
}

// Process a single image (avatar) with Sharp
export const processAvatar = async (file) => {
  if (!sharp) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    const filename = `avatar-${uniqueSuffix}${ext}`
    const filepath = path.join(uploadsDir, filename)
    fs.writeFileSync(filepath, file.buffer)
    return `/uploads/${filename}`
  }

  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
  const filename = `avatar-${uniqueSuffix}.avif`
  const filepath = path.join(uploadsDir, filename)

  await sharp(file.buffer)
    .resize(512, 512, {
      fit: 'cover',
      position: 'center',
    })
    .avif({
      quality: 85,
      effort: 4,
    })
    .toFile(filepath)

  return `/uploads/${filename}`
}

// Delete uploaded files
export const deleteUploadedFile = async (filepath) => {
  try {
    const fullPath = path.join(__dirname, '../../', filepath)
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
    }
  } catch (error) {
    console.error('Error deleting file:', error)
  }
}
