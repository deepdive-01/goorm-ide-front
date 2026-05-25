import axios from 'axios'
import { ACCESS_TOKEN_STORAGE_KEY } from '@/lib/auth'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

export default api
