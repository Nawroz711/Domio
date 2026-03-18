import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const AUTH_STORAGE_KEY = 'domio_auth'

axiosClient.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    }
  } catch {
    // Ignore local storage parse issues.
  }

  return config
})

export default axiosClient
