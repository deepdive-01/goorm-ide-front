import { describe, expect, it } from 'vitest'
import { shouldAttemptTokenRefresh } from './api'

describe('shouldAttemptTokenRefresh', () => {
  it('access token이 없으면 갱신을 시도하지 않는다', () => {
    expect(shouldAttemptTokenRefresh('/api/v1/users/me', false)).toBe(false)
    expect(shouldAttemptTokenRefresh('/api/v1/auth/login', false)).toBe(false)
  })

  it('로그인/회원가입 등 인증 API 401은 갱신을 시도하지 않는다', () => {
    expect(shouldAttemptTokenRefresh('/api/v1/auth/login', true)).toBe(false)
    expect(shouldAttemptTokenRefresh('/api/v1/auth/signup', true)).toBe(false)
    expect(shouldAttemptTokenRefresh('/api/v1/auth/refresh', true)).toBe(false)
    expect(shouldAttemptTokenRefresh('/api/v1/auth/oauth/signup', true)).toBe(false)
    expect(shouldAttemptTokenRefresh('/api/v1/auth/email/send', true)).toBe(false)
    expect(shouldAttemptTokenRefresh('/api/v1/auth/email/verify', true)).toBe(false)
  })

  it('일반 API 401은 access token이 있을 때 갱신을 시도한다', () => {
    expect(shouldAttemptTokenRefresh('/api/v1/users/me', true)).toBe(true)
    expect(shouldAttemptTokenRefresh('/api/v1/spaces', true)).toBe(true)
  })
})
