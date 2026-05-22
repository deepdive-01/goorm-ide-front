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

export const signup = (body: SignupRequest) =>
  api.post<ApiResponse<SignupResponse>>('/api/v1/auth/signup', body)

export const login = (body: LoginRequest) =>
  api.post<ApiResponse<TokenResponse>>('/api/v1/auth/login', body)

export const logout = () => api.post<ApiResponse<null>>('/api/v1/auth/logout')

export const refresh = () =>
  api.post<ApiResponse<TokenResponse>>('/api/v1/auth/refresh')

export const sendEmailCode = (body: EmailSendRequest) =>
  api.post<ApiResponse<null>>('/api/v1/auth/email/send', body)

export const verifyEmailCode = (body: EmailVerifyRequest) =>
  api.post<ApiResponse<null>>('/api/v1/auth/email/verify', body)

export const oauthSignup = (body: OAuthSignupRequest) =>
  api.post<ApiResponse<TokenResponse>>('/api/v1/auth/oauth/signup', body)
