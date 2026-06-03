import { normalizeTokenResponse } from '@/lib/apiMapper'
import api from './api'
import type { ApiResponse } from '@/types/api.type'
import type {
  SignupRequest,
  SignupResponse,
  LoginRequest,
  TokenResponse,
  EmailSendRequest,
  EmailVerifyRequest,
  OAuthSignupRequest,
} from '@/types/auth.type'

/** Swagger LoginRequest — role은 클라이언트에서만 사용 */
type ApiLoginBody = Pick<LoginRequest, 'email' | 'password'>

export const signup = (body: SignupRequest) =>
  api.post<ApiResponse<SignupResponse>>('/api/v1/auth/signup', body)

export const login = async (body: LoginRequest) => {
  const apiBody: ApiLoginBody = {
    email: body.email,
    password: body.password,
  }

  const response = await api.post<ApiResponse<TokenResponse>>(
    '/api/v1/auth/login',
    apiBody,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeTokenResponse(response.data.data),
    },
  }
}

export const logout = () => api.post<ApiResponse<null>>('/api/v1/auth/logout')

export const refresh = async () => {
  const response = await api.post<ApiResponse<TokenResponse>>('/api/v1/auth/refresh')

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeTokenResponse(response.data.data),
    },
  }
}

export const sendEmailCode = (body: EmailSendRequest) =>
  api.post<ApiResponse<null>>('/api/v1/auth/email/send', body)

export const verifyEmailCode = (body: EmailVerifyRequest) =>
  api.post<ApiResponse<null>>('/api/v1/auth/email/verify', body)

export const oauthSignup = async (body: OAuthSignupRequest) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    '/api/v1/auth/oauth/signup',
    body,
  )

  return {
    ...response,
    data: {
      ...response.data,
      data: normalizeTokenResponse(response.data.data),
    },
  }
}
