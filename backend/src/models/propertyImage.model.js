import mongoose from 'mongoose'

const propertyImageSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    caption: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

const PropertyImage = mongoose.model('PropertyImage', propertyImageSchema)

export default PropertyImage