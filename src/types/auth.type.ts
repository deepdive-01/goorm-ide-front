import type { UserRole } from './api.type'

export interface SignupRequest {
  email: string
  password: string
  name: string
  nickname: string
  role: UserRole
}

export interface SignupResponse {
  id: number
  email: string
  name: string
  nickname: string
  role: UserRole
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

export interface EmailSendRequest {
  email: string
}

export interface EmailVerifyRequest {
  email: string
  code: string
}

export interface OAuthSignupRequest {
  temp_key: string
  email: string
  name: string
  nickname: string
  role: UserRole
}
