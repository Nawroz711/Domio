import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axiosClient from '../lib/axiosClient.js'
import { useAuthStore } from '../store/authStore'

const initialForms = {
  signin: {
    email: '',
    password: '',
  },
}

export function useAuth(mode) {
  const navigate = useNavigate()
  const login = useAuthStore((state) => state.login)

  const [formData, setFormData] = useState(initialForms[mode] ?? initialForms.signin)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    if (!formData.email?.trim() || !formData.password?.trim()) {
      return 'Email and password are required.'
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationError = validate()

    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axiosClient.post('/users/signin', formData)
      const token = response?.data?.token
      const user = response?.data?.data

      if (!token || !user) {
        throw new Error('Invalid sign-in response')
      }

      login({ user, token })
      navigate('/admin/dashboard', { replace: true })
    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to sign in. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

    const signUp = async (event) => {
    event.preventDefault()
    const validationError = validate()

    if (validationError) {
      toast.error(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await axiosClient.post('/users/signup', formData)

      if(response.status === 201)
      {
        toast.success(response?.data?.message)
        return;
      }

      if (!token || !user) {
        throw new Error('Invalid sign-up response')
      }

    } catch (error) {
      const message = error?.response?.data?.message || 'Unable to sign up. Please try again.'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    signUp
  }
}
