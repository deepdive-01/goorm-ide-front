import type { TokenResponse } from '@/types/auth.type'
import type { SubmissionDetail } from '@/types/file.type'
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

function readOptionalString(
  record: RecordLike,
  ...keys: string[]
): string | null {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string') {
      return value
    }
  }

  return null
}

// API 응답 — camelCase / snake_case 모두 지원
export function normalizeSubmissionDetail(value: unknown): SubmissionDetail {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid submission payload')
  }

  return {
    id: Number(record.id),
    problem_id:
      Number(record.problemId ?? record.problem_id) || 0,
    student_id:
      Number(record.studentId ?? record.student_id) || 0,
    saved_code: readOptionalString(record, 'savedCode', 'saved_code'),
    submitted_code: readOptionalString(
      record,
      'submittedCode',
      'submitted_code',
    ),
    status: String(record.status ?? 'DRAFT'),
    execution_time_ms:
      typeof record.executionTimeMs === 'number'
        ? record.executionTimeMs
        : typeof record.execution_time_ms === 'number'
          ? record.execution_time_ms
          : null,
    execution_memory_kb:
      typeof record.executionMemoryKb === 'number'
        ? record.executionMemoryKb
        : typeof record.execution_memory_kb === 'number'
          ? record.execution_memory_kb
          : null,
    error_message: readOptionalString(
      record,
      'errorMessage',
      'error_message',
    ),
    created_at:
      readOptionalString(record, 'createdAt', 'created_at') ?? '',
    updated_at:
      readOptionalString(record, 'updatedAt', 'updated_at') ?? '',
  }
}

// 제출 취소는 PENDING일 때만
export function canCancelSubmission(submission: SubmissionDetail | null): boolean {
  return submission?.status === 'PENDING'
}
