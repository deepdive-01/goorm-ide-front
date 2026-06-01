import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { getMe } from './user'

const server = setupServer()

const mockUser = {
  id: 1,
  email: 'user@example.com',
  name: '사용자',
  nickname: 'user',
  role: 'STUDENT' as const,
  profile_image_url: null,
  created_at: '2025-01-01T00:00:00Z',
}

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
afterEach(() => {
  server.resetHandlers()
  vi.restoreAllMocks()
})
afterAll(() => server.close())

beforeEach(() => {
  localStorage.setItem('access_token', 'expired-token')
})

describe('api 401 interceptor + refresh (MSW)', () => {
  it('보호된 API 401 시 refresh를 호출하고 재시도에 성공한다', async () => {
    let refreshCallCount = 0
    let meCallCount = 0

    server.use(
      http.get('*/api/v1/users/me', ({ request }) => {
        meCallCount += 1
        const token = request.headers.get('Authorization')

        if (token === 'Bearer mock-refreshed-token') {
          return HttpResponse.json({
            status: 200,
            code: 'SUCCESS',
            message: 'OK',
            data: mockUser,
          })
        }

        return HttpResponse.json(
          {
            status: 401,
            code: 'UNAUTHORIZED',
            message: '토큰이 만료되었습니다.',
            data: null,
          },
          { status: 401 },
        )
      }),
      http.post('*/api/v1/auth/refresh', () => {
        refreshCallCount += 1
        return HttpResponse.json({
          status: 200,
          code: 'TOKEN_REISSUED',
          message: '토큰이 재발급됐습니다.',
          data: {
            access_token: 'mock-refreshed-token',
            token_type: 'Bearer',
            expires_in: 3600,
          },
        })
      }),
    )

    const { data } = await getMe()

    expect(refreshCallCount).toBe(1)
    expect(meCallCount).toBe(2)
    expect(localStorage.getItem('access_token')).toBe('mock-refreshed-token')
    expect(data.data.email).toBe('user@example.com')
  })

  it('로그인 401은 refresh를 호출하지 않는다', async () => {
    let refreshCallCount = 0

    server.use(
      http.post('*/api/v1/auth/login', () =>
        HttpResponse.json(
          {
            status: 401,
            code: 'INVALID_CREDENTIALS',
            message: '이메일 또는 비밀번호가 올바르지 않습니다.',
            data: null,
          },
          { status: 401 },
        ),
      ),
      http.post('*/api/v1/auth/refresh', () => {
        refreshCallCount += 1
        return HttpResponse.json({
          status: 200,
          code: 'TOKEN_REISSUED',
          data: { access_token: 'x', token_type: 'Bearer', expires_in: 3600 },
        })
      }),
    )

    const { login } = await import('./auth')

    await expect(
      login({
        email: 'user@example.com',
        password: 'WrongPass1!',
        role: 'STUDENT',
      }),
    ).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(refreshCallCount).toBe(0)
  })

  it('refresh 실패 시 토큰을 제거하고 로그인 페이지가 아니면 이동한다', async () => {
    let href = 'http://localhost/student/spaces'
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        pathname: '/student/spaces',
        get href() {
          return href
        },
        set href(value: string) {
          href = value
        },
      },
    })

    server.use(
      http.get('*/api/v1/users/me', () =>
        HttpResponse.json(
          {
            status: 401,
            code: 'UNAUTHORIZED',
            message: '만료',
            data: null,
          },
          { status: 401 },
        ),
      ),
      http.post('*/api/v1/auth/refresh', () =>
        HttpResponse.json(
          {
            status: 401,
            code: 'INVALID_REFRESH',
            message: 'refresh 실패',
            data: null,
          },
          { status: 401 },
        ),
      ),
    )

    await expect(getMe()).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(href).toBe('/login')
  })

  it('refresh 실패해도 이미 로그인 페이지면 location 이동을 하지 않는다', async () => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        pathname: '/login',
        href: 'http://localhost/login',
      },
    })

    server.use(
      http.get('*/api/v1/users/me', () =>
        HttpResponse.json(
          { status: 401, code: 'UNAUTHORIZED', message: '만료', data: null },
          { status: 401 },
        ),
      ),
      http.post('*/api/v1/auth/refresh', () =>
        HttpResponse.json(
          { status: 401, code: 'INVALID_REFRESH', message: '실패', data: null },
          { status: 401 },
        ),
      ),
    )

    await expect(getMe()).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(window.location.href).toBe('http://localhost/login')
  })
})
