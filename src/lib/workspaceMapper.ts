import type {
  WorkspaceCreated,
  WorkspaceDetail,
  WorkspaceListItem,
  WorkspaceMember,
  WorkspaceMembersResponse,
  WorkspaceUpdated,
} from '@/types/workspace.type'

type RecordLike = Record<string, unknown>

function asRecord(value: unknown): RecordLike | null {
  if (typeof value !== 'object' || value === null) {
    return null
  }

  return value as RecordLike
}

function readString(record: RecordLike, camelKey: string, snakeKey: string): string {
  const camel = record[camelKey]
  if (typeof camel === 'string') {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'string') {
    return snake
  }

  return ''
}

function readNumber(record: RecordLike, camelKey: string, snakeKey: string): number {
  const camel = record[camelKey]
  if (typeof camel === 'number' && Number.isFinite(camel)) {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'number' && Number.isFinite(snake)) {
    return snake
  }

  return 0
}

function readBoolean(record: RecordLike, camelKey: string, snakeKey: string): boolean {
  const camel = record[camelKey]
  if (typeof camel === 'boolean') {
    return camel
  }

  const snake = record[snakeKey]
  if (typeof snake === 'boolean') {
    return snake
  }

  return false
}

/** API 응답 — Swagger(camelCase)와 snake_case 모두 지원 */
export function normalizeWorkspaceListItem(value: unknown): WorkspaceListItem {
  const record = asRecord(value)

  if (!record) {
    return {
      id: 0,
      name: '',
      description: '',
      member_count: 0,
      is_active: false,
      created_at: '',
    }
  }

  return {
    id: readNumber(record, 'id', 'id'),
    name: readString(record, 'name', 'name'),
    description: readString(record, 'description', 'description'),
    member_count: readNumber(record, 'memberCount', 'member_count'),
    is_active: readBoolean(record, 'isActive', 'is_active'),
    created_at: readString(record, 'createdAt', 'created_at'),
    mentor_name: readString(record, 'mentorName', 'mentor_name') || undefined,
    problem_count: readNumber(record, 'problemCount', 'problem_count') || undefined,
    file_count: readNumber(record, 'fileCount', 'file_count') || undefined,
  }
}

export function normalizeWorkspaceList(value: unknown): WorkspaceListItem[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.map((item) => normalizeWorkspaceListItem(item))
}

/** API 응답 — Swagger(camelCase)와 snake_case 모두 지원 */
export function normalizeWorkspaceDetail(value: unknown): WorkspaceDetail {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid workspace payload')
  }

  const mentorRecord = asRecord(record.mentor)

  return {
    id: readNumber(record, 'id', 'id'),
    name: readString(record, 'name', 'name'),
    description: readString(record, 'description', 'description'),
    mentor: {
      id: mentorRecord ? readNumber(mentorRecord, 'id', 'id') : 0,
      nickname: mentorRecord
        ? readString(mentorRecord, 'nickname', 'nickname')
        : '',
    },
    invite_code:
      readString(record, 'inviteCode', 'invite_code') || undefined,
    member_count: readNumber(record, 'memberCount', 'member_count'),
    is_public: readBoolean(record, 'isPublic', 'is_public'),
    is_active: readBoolean(record, 'isActive', 'is_active'),
    created_at: readString(record, 'createdAt', 'created_at'),
  }
}

export function normalizeWorkspaceCreated(value: unknown): WorkspaceCreated {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid workspace created payload')
  }

  return {
    id: readNumber(record, 'id', 'id'),
    name: readString(record, 'name', 'name'),
    description: readString(record, 'description', 'description'),
    is_public: readBoolean(record, 'isPublic', 'is_public'),
    invite_code: readString(record, 'inviteCode', 'invite_code'),
    is_active: readBoolean(record, 'isActive', 'is_active'),
    created_at: readString(record, 'createdAt', 'created_at'),
  }
}

export function normalizeWorkspaceUpdated(value: unknown): WorkspaceUpdated {
  const record = asRecord(value)

  if (!record) {
    throw new Error('Invalid workspace updated payload')
  }

  return {
    id: readNumber(record, 'id', 'id'),
    name: readString(record, 'name', 'name'),
    description: readString(record, 'description', 'description'),
    updated_at: readString(record, 'updatedAt', 'updated_at'),
  }
}

export function normalizeWorkspaceMember(value: unknown): WorkspaceMember {
  const record = asRecord(value)

  if (!record) {
    return {
      user_id: 0,
      nickname: '',
      profile_image_url: null,
      joined_at: '',
    }
  }

  const profileImage =
    (typeof record.profileImageUrl === 'string' && record.profileImageUrl) ||
    (typeof record.profile_image_url === 'string' && record.profile_image_url) ||
    null

  return {
    user_id: readNumber(record, 'userId', 'user_id'),
    nickname: readString(record, 'nickname', 'nickname'),
    profile_image_url: profileImage,
    joined_at: readString(record, 'joinedAt', 'joined_at'),
  }
}

export function normalizeWorkspaceMembersResponse(
  value: unknown,
): WorkspaceMembersResponse {
  const record = asRecord(value)

  if (!record) {
    return {
      space_id: 0,
      space_name: '',
      member_count: 0,
      members: [],
    }
  }

  const members = Array.isArray(record.members)
    ? record.members.map((member) => normalizeWorkspaceMember(member))
    : []

  return {
    space_id: readNumber(record, 'spaceId', 'space_id'),
    space_name: readString(record, 'spaceName', 'space_name'),
    member_count: readNumber(record, 'memberCount', 'member_count'),
    members,
  }
}
