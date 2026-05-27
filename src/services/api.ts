import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@/types/api.type'
import type { TokenResponse } from '@/types/auth.type'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // RT 쿠키 전송은 프로덕션에서만 필요 — 개발 중 MSW 사용 시 CORS preflight 방지
  withCredentials: import.meta.env.VITE_MSW_ENABLED !== 'true',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetryableConfig

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true

      try {
        const { data } = await api.post<ApiResponse<TokenResponse>>(
          '/api/v1/auth/refresh',
        )
        localStorage.setItem('access_token', data.data.access_token)
        original.headers.Authorization = `Bearer ${data.data.access_token}`
        return api(original)
      } catch {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default api
