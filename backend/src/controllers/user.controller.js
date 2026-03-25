import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import path from 'path'
import fs from 'fs'
import User from '../models/user.model.js'
import { getUsers, updateUserStatus } from '../services/users.services.js'

const SALT_ROUNDS = 12

export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body

    if (!name?.trim() || !email?.trim() || !password?.trim() || !phone?.trim()) {
      return res.status(400).json({ message: 'Name, email, password, and phone are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    if (phone.trim().length < 7 || phone.trim().length > 20) {
      return res.status(400).json({ message: 'Phone number length is invalid' })
    }

    const normalizedEmail = email.toLowerCase()
    const normalizedPhone = phone.trim()

    // Check if email already exists
    const existingEmail = await User.findOne({ email: normalizedEmail })
    if (existingEmail) {
      return res.status(409).json({ message: 'Email already exists' })
    }

    // Check if phone already exists
    const existingPhone = await User.findOne({ phone: normalizedPhone })
    if (existingPhone) {
      return res.status(409).json({ message: 'Phone number already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone.trim(),
    })

    return res.status(201).json({ message: 'Account created successfully, we will send email when you account has been approved!' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create user', error: error.message })
  }
}

export const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('password isActive')

    if (!user.isActive) {
      return res.status(401).json({ message: 'Your account is not activited!' })
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' })
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, { expiresIn: '7d' })

    return res.status(200).json({
      message: 'Signed in successfully',
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        avatar: user.avatar,
      },
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to sign in', error: error.message })
  }
}

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json({ data: user })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load profile', error: error.message })
  }
}

export const updateMyProfile = async (req, res) => {
  try {
    const { name, phone, address, province } = req.body

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Only update fields that are provided
    if (name !== undefined) user.name = name.trim()
    if (phone !== undefined) user.phone = phone.trim()
    if (address !== undefined) user.address = address.trim()
    if (province !== undefined) user.province = province.trim()

    await user.save()
    const safeUser = await User.findById(user._id).select('-password')

    return res.status(200).json({
      message: 'Profile updated successfully',
      data: safeUser,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update profile', error: error.message })
  }
}


export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete old avatar if exists and is not a default image
    if (user.avatar && user.avatar.startsWith('/uploads/')) {
      const oldAvatarPath = path.join(process.cwd(), user.avatar)
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath)
      }
    }

    // Save the file path
    const avatarPath = `/uploads/${req.file.filename}`
    user.avatar = avatarPath
    await user.save()

    const safeUser = await User.findById(user._id).select('-password')

    return res.status(200).json({
      message: 'Avatar uploaded successfully',
      data: safeUser,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to upload avatar', error: error.message })
  }
}

export const deleteMyAccount = async (req, res) => {
  try {
    const { confirmName } = req.body
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!confirmName?.trim()) {
      return res.status(400).json({ message: 'Please type your name to confirm deletion' })
    }

    if (confirmName.trim() !== user.name) {
      return res.status(400).json({ message: 'Confirmation name does not match your profile name' })
    }

    await User.findByIdAndDelete(req.userId)
    return res.status(200).json({ message: 'Account deleted successfully' })
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete account', error: error.message })
  }
}


// User management section methods

export const users = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.get('x-user-id');

    // Extract filter params
    const filters = {
      search: req.query.search || '',
      province: req.query.province || '',
      status: req.query.status || '',
      role: req.query.role || '',
    };

    const users = await getUsers(page, limit, userId, filters);

    if (!users) {
      return res.status(404).json({ message: 'Users not found' });
    }

    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Failed to fetch users', error: e.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive status is required' });
    }

    const user = await updateUserStatus(userId, isActive);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Failed to update user status', error: e.message });
  }
};
