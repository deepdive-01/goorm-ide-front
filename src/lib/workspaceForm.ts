import axios from 'axios'
import { TEACHER_SPACES_COPY } from '@/content/teacherSpaces'

export const WORKSPACE_NAME_MAX_LENGTH = 100
export const WORKSPACE_DESCRIPTION_MAX_LENGTH = 500

export function getCreateWorkspaceErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return TEACHER_SPACES_COPY.createError
  }

  if (!error.response) {
    return '네트워크 연결 오류가 발생했습니다. 다시 시도해주세요.'
  }

  const responseCode =
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'code' in error.response.data &&
    typeof error.response.data.code === 'string'
      ? error.response.data.code
      : null

  if (
    responseCode === 'SPACE_NAME_DUPLICATED' ||
    responseCode === 'DUPLICATE_SPACE_NAME' ||
    error.response.status === 409
  ) {
    return TEACHER_SPACES_COPY.createDuplicateName
  }

  if (error.response.status >= 500) {
    return TEACHER_SPACES_COPY.createError
  }

  return TEACHER_SPACES_COPY.createError
}

export function validateWorkspaceName(name: string): string | null {
  const trimmed = name.trim()

  if (!trimmed) {
    return TEACHER_SPACES_COPY.createNameRequired
  }

  if (trimmed.length > WORKSPACE_NAME_MAX_LENGTH) {
    return TEACHER_SPACES_COPY.createNameTooLong
  }

  return null
}

export function validateWorkspaceDescription(description: string): string | null {
  if (description.length > WORKSPACE_DESCRIPTION_MAX_LENGTH) {
    return TEACHER_SPACES_COPY.createDescriptionTooLong
  }

  return null
}
