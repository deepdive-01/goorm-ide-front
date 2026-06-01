import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { toSnakeCaseKeys } from '@/lib/apiCase'
import { extractAccessToken } from '@/lib/apiMapper'
import type { ApiResponse } from '@/types/api.type'
import type { TokenResponse } from '@/types/auth.type'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

/** 로그인/회원가입 등 인증 API 401은 자격 증명 오류이므로 토큰 갱신을 시도하지 않습니다. */
const AUTH_PATHS_WITHOUT_TOKEN_REFRESH = [
  '/api/v1/auth/login',
  '/api/v1/auth/signup',
  '/api/v1/auth/refresh',
  '/api/v1/auth/oauth/signup',
  '/api/v1/auth/email/send',
  '/api/v1/auth/email/verify',
  '/api/v1/auth/logout',
] as const

export function shouldAttemptTokenRefresh(
  url: string | undefined,
  hasAccessToken: boolean,
): boolean {
  if (!hasAccessToken) {
    return false
  }

  const requestUrl = url ?? ''
  return !AUTH_PATHS_WITHOUT_TOKEN_REFRESH.some((path) => requestUrl.includes(path))
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config.data && !(config.data instanceof FormData)) {
    config.data = toSnakeCaseKeys(config.data)
  }

  if (config.params) {
    config.params = toSnakeCaseKeys(config.params)
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetryableConfig | undefined

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      shouldAttemptTokenRefresh(
        original.url,
        Boolean(localStorage.getItem('access_token')),
      )
    ) {
      original._retry = true

      try {
        const { data } = await api.post<ApiResponse<TokenResponse>>(
          '/api/v1/auth/refresh',
        )
        const accessToken = extractAccessToken(data.data)
        localStorage.setItem('access_token', accessToken)
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch {
        localStorage.removeItem('access_token')

        if (window.location.pathname !== '/login') {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

export default api
