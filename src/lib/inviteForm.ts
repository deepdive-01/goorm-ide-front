import axios from 'axios'
import { TEACHER_INVITE_STUDENTS_COPY } from '@/content/teacherInviteStudents'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readApiResponseCode(error: unknown): string | null {
  if (!axios.isAxiosError(error) || !error.response) {
    return null
  }

  const data = error.response.data
  if (typeof data === 'object' && data !== null && 'code' in data && typeof data.code === 'string') {
    return data.code
  }

  return null
}

export function validateInviteEmailInput(email: string): string | null {
  const trimmed = email.trim()

  if (!trimmed) {
    return TEACHER_INVITE_STUDENTS_COPY.emailRequired
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return TEACHER_INVITE_STUDENTS_COPY.invalidEmail
  }

  return null
}

export function getInviteByEmailErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    return TEACHER_INVITE_STUDENTS_COPY.sendError
  }

  if (!error.response) {
    return TEACHER_INVITE_STUDENTS_COPY.networkError
  }

  const responseCode = readApiResponseCode(error)

  if (
    responseCode === 'USER_NOT_FOUND' ||
    responseCode === 'EMAIL_NOT_FOUND' ||
    responseCode === 'INVITE_USER_NOT_FOUND'
  ) {
    return TEACHER_INVITE_STUDENTS_COPY.userNotFound
  }

  if (
    responseCode === 'MEMBER_ALREADY_EXISTS' ||
    responseCode === 'ALREADY_MEMBER' ||
    responseCode === 'SPACE_MEMBER_ALREADY_EXISTS' ||
    responseCode === 'USER_ALREADY_JOINED'
  ) {
    return TEACHER_INVITE_STUDENTS_COPY.alreadyMember
  }

  if (responseCode === 'SPACE_NOT_FOUND' || error.response.status === 404) {
    return TEACHER_INVITE_STUDENTS_COPY.invalidSpace
  }

  if (error.response.status >= 500) {
    return TEACHER_INVITE_STUDENTS_COPY.serverError
  }

  return TEACHER_INVITE_STUDENTS_COPY.sendError
}
