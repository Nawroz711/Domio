import { useEffect, useState, useRef } from 'react'
import { toast } from 'react-toastify'
import axiosClient from '../lib/axiosClient'
import { useAuthStore } from '../store/authStore'

export function useProfile() {
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser)
  const logout = useAuthStore((state) => state.logout)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    province: '',
  })
  const [confirmName, setConfirmName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axiosClient.get('/users/profile')
        const profile = response?.data?.data
        if (profile) {
          setUser(profile)
          setFormData({
            name: profile.name || '',
            phone: profile.phone || '',
            address: profile.address || '',
            province: profile.province || '',
          })
          // Set avatar preview if exists
          if (profile.avatar) {
            const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
            const avatarUrl = profile.avatar.startsWith('http') ? profile.avatar : `${baseURL}${profile.avatar}`
            setAvatarPreview(avatarUrl)
          }
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Failed to load profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [setUser])

  const handleChange = (event) => {
    // Handle react-select event (has 'value' property)
    if (event && event.value) {
      setFormData((prev) => ({ ...prev, province: event.value }))
      return
    }
    // Handle regular input events
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!formData.name.trim()) {
      toast.error('Name is required')
      return
    }

    if (!formData.phone.trim()) {
      toast.error('Phone is required')
      return
    }

    if (formData.phone.trim().length < 7 || formData.phone.trim().length > 20) {
      toast.error('Phone number length is invalid')
      return
    }

    setIsSaving(true)

    try {
      const response = await axiosClient.put('/users/profile', {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        province: formData.province.trim(),
      })
      const updated = response?.data?.data
      if (updated) {
        setUser(updated)
      }
      toast.success(response?.data?.message || 'Profile updated successfully')
    } catch (error) {
      const errorData = error?.response?.data
      // Check if there are validation errors (array of errors)
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Display all validation errors
        errorData.errors.forEach((err) => {
          toast.error(err.message)
        })
      } else {
        toast.error(errorData?.message || 'Failed to update profile')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirmName.trim()) {
      toast.error('Type your name to confirm deletion')
      return
    }

    setIsDeleting(true)
    try {
      const response = await axiosClient.delete('/users/profile', {
        data: { confirmName: confirmName.trim() },
      })
      toast.success(response?.data?.message || 'Account deleted')
      logout()
      window.location.href = '/signin'
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete account')
    } finally {
      setIsDeleting(false)
    }
  }


  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Only image files are allowed (jpeg, jpg, png, gif, webp)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    // Create local preview
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)

    setIsUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await axiosClient.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      const updated = response?.data?.data
      if (updated) {
        setUser(updated)
        // Update the preview with the server URL
        if (updated.avatar) {
          const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
          const avatarUrl = updated.avatar.startsWith('http') ? updated.avatar : `${baseURL}${updated.avatar}`
          setAvatarPreview(avatarUrl)
        }
      }
      toast.success(response?.data?.message || 'Avatar uploaded successfully')
    } catch (error) {
      // Revert preview on error
      if (user?.avatar) {
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
        const avatarUrl = user.avatar.startsWith('http') ? user.avatar : `${baseURL}${user.avatar}`
        setAvatarPreview(avatarUrl)
      } else {
        setAvatarPreview(null)
      }
      const errorData = error?.response?.data
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err) => {
          toast.error(err.message)
        })
      } else {
        toast.error(errorData?.message || 'Failed to upload avatar')
      }
    } finally {
      setIsUploadingAvatar(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return {
    user,
    formData,
    confirmName,
    isLoading,
    isSaving,
    isDeleting,
    avatarPreview,
    isUploadingAvatar,
    fileInputRef,
    handleChange,
    handleSubmit,
    setConfirmName,
    handleDeleteAccount,
    handleAvatarChange,
    triggerFileInput,
  }
}
