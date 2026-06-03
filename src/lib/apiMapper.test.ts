import { describe, expect, it } from 'vitest'
import { extractAccessToken, normalizeTokenResponse, normalizeUserInfo } from './apiMapper'

describe('apiMapper', () => {
  it('camelCase 토큰 응답을 정규화한다', () => {
    expect(
      normalizeTokenResponse({
        accessToken: 'abc',
        tokenType: 'Bearer',
        expiresIn: 3600,
      }),
    ).toEqual({
      access_token: 'abc',
      token_type: 'Bearer',
      expires_in: 3600,
    })
  })

  it('camelCase 사용자 응답을 정규화한다', () => {
    expect(
      normalizeUserInfo({
        id: 1,
        email: 'user@example.com',
        name: '홍길동',
        nickname: '길동',
        role: 'STUDENT',
        profileImageUrl: null,
        createdAt: '2025-01-01T00:00:00Z',
      }),
    ).toEqual({
      id: 1,
      email: 'user@example.com',
      name: '홍길동',
      nickname: '길동',
      role: 'STUDENT',
      profile_image_url: null,
      created_at: '2025-01-01T00:00:00Z',
    })
  })

  it('extractAccessToken은 snake_case도 지원한다', () => {
    expect(extractAccessToken({ access_token: 'legacy' })).toBe('legacy')
  })
})
