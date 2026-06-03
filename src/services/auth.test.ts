import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import {
  login,
  logout,
  oauthSignup,
  refresh,
  sendEmailCode,
  signup,
  verifyEmailCode,
} from './auth'

const server = setupServer()

function jsonSuccess<T>(data: T) {
  return HttpResponse.json({
    status: 200,
    code: 'SUCCESS',
    message: 'OK',
    data,
  })
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

beforeEach(() => {
  localStorage.clear()
})

describe('auth service (MSW)', () => {
  it('signup은 /api/v1/auth/signup으로 요청 본문을 전송한다', async () => {
    let capturedUrl = ''
    let capturedBody: unknown

    server.use(
      http.post('*/api/v1/auth/signup', async ({ request }) => {
        capturedUrl = new URL(request.url).pathname
        capturedBody = await request.json()
        return jsonSuccess({
          id: 1,
          email: 'new@example.com',
          name: '홍길동',
          nickname: '길동',
          role: 'STUDENT',
          created_at: '2025-01-01T00:00:00Z',
        })
      }),
    )

    await signup({
      email: 'new@example.com',
      password: 'Password1!',
      name: '홍길동',
      nickname: '길동',
      role: 'STUDENT',
    })

    expect(capturedUrl).toBe('/api/v1/auth/signup')
    expect(capturedBody).toEqual({
      email: 'new@example.com',
      password: 'Password1!',
      name: '홍길동',
      nickname: '길동',
      role: 'STUDENT',
    })
  })

  it('login은 role 없이 email/password만 /api/v1/auth/login으로 전송한다', async () => {
    let capturedBody: unknown

    server.use(
      http.post('*/api/v1/auth/login', async ({ request }) => {
        capturedBody = await request.json()
        return jsonSuccess({
          access_token: 'login-token',
          token_type: 'Bearer',
          expires_in: 3600,
        })
      }),
    )

    const { data } = await login({
      email: 'user@example.com',
      password: 'Password1!',
      role: 'MENTOR',
    })

    expect(capturedBody).toEqual({
      email: 'user@example.com',
      password: 'Password1!',
    })
    expect(data.data.access_token).toBe('login-token')
  })

  it('logout은 /api/v1/auth/logout으로 POST한다', async () => {
    let capturedMethod = ''
    let capturedUrl = ''

    server.use(
      http.post('*/api/v1/auth/logout', ({ request }) => {
        capturedMethod = request.method
        capturedUrl = new URL(request.url).pathname
        return jsonSuccess(null)
      }),
    )

    await logout()

    expect(capturedMethod).toBe('POST')
    expect(capturedUrl).toBe('/api/v1/auth/logout')
  })

  it('refresh는 /api/v1/auth/refresh로 POST하고 토큰을 정규화한다', async () => {
    let capturedUrl = ''

    server.use(
      http.post('*/api/v1/auth/refresh', ({ request }) => {
        capturedUrl = new URL(request.url).pathname
        return jsonSuccess({
          accessToken: 'refreshed-token',
          tokenType: 'Bearer',
          expiresIn: 3600,
        })
      }),
    )

    const { data } = await refresh()

    expect(capturedUrl).toBe('/api/v1/auth/refresh')
    expect(data.data.access_token).toBe('refreshed-token')
  })

  it('sendEmailCode는 /api/v1/auth/email/send로 email을 전송한다', async () => {
    let capturedUrl = ''
    let capturedBody: unknown

    server.use(
      http.post('*/api/v1/auth/email/send', async ({ request }) => {
        capturedUrl = new URL(request.url).pathname
        capturedBody = await request.json()
        return jsonSuccess(null)
      }),
    )

    await sendEmailCode({ email: 'verify@example.com' })

    expect(capturedUrl).toBe('/api/v1/auth/email/send')
    expect(capturedBody).toEqual({ email: 'verify@example.com' })
  })

  it('verifyEmailCode는 /api/v1/auth/email/verify로 email과 code를 전송한다', async () => {
    let capturedBody: unknown

    server.use(
      http.post('*/api/v1/auth/email/verify', async ({ request }) => {
        capturedBody = await request.json()
        return jsonSuccess(null)
      }),
    )

    await verifyEmailCode({ email: 'verify@example.com', code: '123456' })

    expect(capturedBody).toEqual({
      email: 'verify@example.com',
      code: '123456',
    })
  })

  it('oauthSignup은 /api/v1/auth/oauth/signup으로 요청 본문을 전송한다', async () => {
    let capturedUrl = ''
    let capturedBody: unknown

    server.use(
      http.post('*/api/v1/auth/oauth/signup', async ({ request }) => {
        capturedUrl = new URL(request.url).pathname
        capturedBody = await request.json()
        return jsonSuccess({
          access_token: 'oauth-token',
          token_type: 'Bearer',
          expires_in: 3600,
        })
      }),
    )

    const { data } = await oauthSignup({
      temp_key: 'temp-key-uuid',
      email: 'kakao@example.com',
      name: '카카오',
      nickname: 'kakao_user',
      role: 'MENTOR',
    })

    expect(capturedUrl).toBe('/api/v1/auth/oauth/signup')
    expect(capturedBody).toEqual({
      temp_key: 'temp-key-uuid',
      email: 'kakao@example.com',
      name: '카카오',
      nickname: 'kakao_user',
      role: 'MENTOR',
    })
    expect(data.data.access_token).toBe('oauth-token')
  })
})
