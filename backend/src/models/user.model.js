import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      Enumerator: ['super admin' , 'agent'],
      default: 'agent',
    },
    address: {
      type: String,
      trim: true,
      required: false
    },
    avatar: {
      type: String,
      trim: true,
      default: '',
    }
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)

export default User
