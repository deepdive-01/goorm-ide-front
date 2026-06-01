import type { TokenResponse } from '@/types/auth.type'
import type { UserInfo } from '@/types/user.type'
import type { UserRole } from '@/types/api.type'

type RecordLike = Record<string, unknown>

function asRecord(value: unknown): RecordLike | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as RecordLike
}

/** API 응답 — Swagger 문서(camelCase)와 snake_case 모두 지원 */
export function normalizeTokenResponse(value: unknown): TokenResponse {
  const record = asRecord(value)

  if (!record) {
    return {
      access_token: '',
      token_type: 'Bearer',
      expires_in: 0,
    }
  }

  const accessToken =
    (typeof record.accessToken === 'string' && record.accessToken) ||
    (typeof record.access_token === 'string' && record.access_token) ||
    ''

  const tokenType =
    (typeof record.tokenType === 'string' && record.tokenType) ||
    (typeof record.token_type === 'string' && record.token_type) ||
    'Bearer'

  const expiresIn =
    (typeof record.expiresIn === 'number' && record.expiresIn) ||
    (typeof record.expires_in === 'number' && record.expires_in) ||
    0

  return {
    access_token: accessToken,
    token_type: tokenType,
    expires_in: expiresIn,
  }
}

/** API 응답 — Swagger 문서(camelCase)와 snake_case 모두 지원 */
export function normalizeUserInfo(value: unknown): UserInfo {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid user payload')
  }

  const role = record.role as UserRole

  return {
    id: Number(record.id),
    email: String(record.email ?? ''),
    name: String(record.name ?? ''),
    nickname: String(record.nickname ?? ''),
    role,
    profile_image_url:
      (typeof record.profileImageUrl === 'string' && record.profileImageUrl) ||
      (typeof record.profile_image_url === 'string' && record.profile_image_url) ||
      null,
    created_at:
      (typeof record.createdAt === 'string' && record.createdAt) ||
      (typeof record.created_at === 'string' && record.created_at) ||
      '',
  }
}

export function extractAccessToken(data: unknown): string {
  return normalizeTokenResponse(data).access_token
}
