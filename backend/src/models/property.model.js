import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 5000,
    },
    propertyType: {
      type: String,
      required: true,
      enum: ['house', 'apartment', 'land', 'commercial', 'villa', 'building'],
      default: 'house',
    },
    listingType: {
      type: String,
      required: true,
      enum: ['sale', 'rent', 'lease'],
      default: 'sale',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    area: {
      type: Number,
      required: true,
      min: 1,
    },
    bedrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    bathrooms: {
      type: Number,
      default: 0,
      min: 0,
    },
    floors: {
      type: Number,
      default: 1,
      min: 1,
    },
    yearBuilt: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 5,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    province: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    district: {
      type: String,
      trim: true,
      default: '',
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    features: [{
      type: String,
      trim: true,
    }],
    images: [{
      type: String,
      trim: true,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    agent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

// Text index for search
propertySchema.index(
  { 
    title: 'text', 
    description: 'text', 
    address: 'text',
    city: 'text',
    district: 'text'
  },
  { 
    default_language: 'english',
    weights: {
      title: 10,
      description: 5,
      address: 3,
      city: 2,
      district: 2
    }
  }
)

propertySchema.plugin(mongoosePaginate)

const Property = mongoose.model('Property', propertySchema)

export default Property