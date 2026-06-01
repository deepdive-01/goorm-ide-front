import axios from 'axios'
import type { UserRole } from '@/types/api.type'
import type { OAuthIntent, OAuthProvider } from '@/types/auth.type'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PASSWORD_LENGTH = 8
/** Swagger SignupRequest.password 패턴 */
const SIGNUP_PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/
const DEFAULT_NETWORK_ERROR_MESSAGE = '네트워크 연결 오류가 발생했습니다. 다시 시도해주세요.'
const DEFAULT_SERVER_ERROR_MESSAGE = '잠시 후 다시 시도해주세요.'

export const ACCESS_TOKEN_STORAGE_KEY = 'access_token'
export const OAUTH_INTENDED_ROLE_KEY = 'oauth_intended_role'

interface AuthErrorResolverOptions {
  byCode?: Record<string, string>
  byStatus?: Partial<Record<number, string>>
  defaultMessage: string
  networkMessage?: string
}

interface SocialAuthOptions {
  intent: OAuthIntent
  provider: OAuthProvider
  role: UserRole
}

export function getRoleHomePath(role: UserRole): string {
  return role === 'STUDENT' ? '/student/spaces' : '/teacher/spaces'
}

export function persistOAuthIntendedRole(role: UserRole): void {
  sessionStorage.setItem(OAUTH_INTENDED_ROLE_KEY, role)
}

export function readOAuthIntendedRole(): UserRole | null {
  const role = sessionStorage.getItem(OAUTH_INTENDED_ROLE_KEY)
  if (role === 'MENTOR' || role === 'STUDENT') {
    return role
  }
  return null
}

export function clearOAuthIntendedRole(): void {
  sessionStorage.removeItem(OAUTH_INTENDED_ROLE_KEY)
}

/** OAuth 리다이렉트 URL의 role 쿼리 → sessionStorage 순으로 로그인 시 선택 역할 복원 */
export function resolveOAuthRole(roleFromQuery: string | null): UserRole | null {
  if (roleFromQuery === 'MENTOR' || roleFromQuery === 'STUDENT') {
    return roleFromQuery
  }
  return readOAuthIntendedRole()
}

export function saveAccessToken(token: string): void {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token)
}

export function clearAccessToken(): void {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
}

export function validateRequired(
  value: string,
  message: string,
): string | null {
  return value.trim() ? null : message
}

export function validateEmail(email: string): string | null {
  const trimmedEmail = email.trim()

  if (!trimmedEmail) {
    return '이메일을 입력해주세요'
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return '올바른 이메일 형식이 아닙니다'
  }

  return null
}

export function validatePassword(password: string): string | null {
  if (!password.trim()) {
    return '비밀번호를 입력해주세요'
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return '비밀번호는 8자 이상 입력해주세요'
  }

  return null
}

/** 회원가입 API 비밀번호 규칙 (영문+숫자+특수문자, 8~20자) */
export function validateSignupPassword(password: string): string | null {
  const required = validatePassword(password)
  if (required) {
    return required
  }

  if (!SIGNUP_PASSWORD_REGEX.test(password)) {
    return '비밀번호는 8~20자이며 영문, 숫자, 특수문자(@$!%*#?&)를 포함해야 합니다'
  }

  return null
}

export function validateVerificationCode(code: string): string | null {
  return validateRequired(code, '인증코드를 입력해주세요')
}

export function resolveAuthErrorMessage(
  error: unknown,
  options: AuthErrorResolverOptions,
): string {
  if (!axios.isAxiosError(error)) {
    return options.defaultMessage
  }

  if (!error.response) {
    return options.networkMessage ?? DEFAULT_NETWORK_ERROR_MESSAGE
  }

  const responseCode =
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'code' in error.response.data &&
    typeof error.response.data.code === 'string'
      ? error.response.data.code
      : null

  if (responseCode && options.byCode?.[responseCode]) {
    return options.byCode[responseCode]
  }

  const statusMessage = options.byStatus?.[error.response.status]
  if (statusMessage) {
    return statusMessage
  }

  return options.defaultMessage
}

export function getLoginErrorMessage(error: unknown): string {
  return resolveAuthErrorMessage(error, {
    byCode: {
      AUTH_ROLE_MISMATCH: '선택한 사용자 유형이 올바르지 않습니다',
      ROLE_MISMATCH: '선택한 사용자 유형이 올바르지 않습니다',
      AUTH_ACCOUNT_NOT_FOUND: '존재하지 않는 계정입니다. 회원가입을 진행해주세요.',
      ACCOUNT_NOT_FOUND: '존재하지 않는 계정입니다. 회원가입을 진행해주세요.',
      AUTH_INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
      INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
    },
    byStatus: {
      401: '이메일 또는 비밀번호가 올바르지 않습니다',
      403: '선택한 사용자 유형이 올바르지 않습니다',
      404: '존재하지 않는 계정입니다. 회원가입을 진행해주세요.',
    },
    defaultMessage: DEFAULT_SERVER_ERROR_MESSAGE,
  })
}

export function getSignupErrorMessage(error: unknown): string {
  return resolveAuthErrorMessage(error, {
    byCode: {
      AUTH_EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다',
      EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다',
      EMAIL_NOT_VERIFIED: '이메일 인증을 완료해주세요',
      INVALID_PASSWORD: '비밀번호는 8~20자이며 영문, 숫자, 특수문자(@$!%*#?&)를 포함해야 합니다',
    },
    byStatus: {
      409: '이미 사용 중인 이메일입니다',
      400: '입력값을 확인해주세요',
    },
    defaultMessage: '회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.',
  })
}

export function getEmailSendErrorMessage(error: unknown): string {
  return resolveAuthErrorMessage(error, {
    byCode: {
      AUTH_EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다',
      EMAIL_ALREADY_EXISTS: '이미 사용 중인 이메일입니다',
    },
    byStatus: {
      409: '이미 사용 중인 이메일입니다',
    },
    defaultMessage: '인증코드 발송에 실패했습니다. 잠시 후 다시 시도해주세요.',
  })
}

export function getEmailVerifyErrorMessage(error: unknown): string {
  return resolveAuthErrorMessage(error, {
    byCode: {
      AUTH_EMAIL_CODE_MISMATCH: '인증코드가 올바르지 않습니다',
      INVALID_VERIFY_CODE: '인증코드가 올바르지 않습니다',
      AUTH_EMAIL_CODE_EXPIRED: '인증코드가 만료되었습니다',
      VERIFY_CODE_EXPIRED: '인증코드가 만료되었습니다',
    },
    byStatus: {
      400: '인증코드가 올바르지 않습니다',
      410: '인증코드가 만료되었습니다',
    },
    defaultMessage: '이메일 인증에 실패했습니다. 다시 시도해주세요.',
  })
}

export function getAdditionalInfoErrorMessage(error: unknown): string {
  return resolveAuthErrorMessage(error, {
    byCode: {
      AUTH_EMAIL_ALREADY_EXISTS:
        '이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.',
      EMAIL_ALREADY_EXISTS:
        '이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.',
      AUTH_INVALID_TEMP_KEY: '유효하지 않은 가입 요청입니다. 다시 소셜 로그인을 시도해 주세요.',
      INVALID_TEMP_KEY: '유효하지 않은 가입 요청입니다. 다시 소셜 로그인을 시도해 주세요.',
    },
    byStatus: {
      409: '이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.',
      400: '입력값을 확인해주세요',
    },
    defaultMessage: '가입을 완료하지 못했습니다. 잠시 후 다시 시도해주세요.',
  })
}

export function buildSocialAuthUrl({ provider, role }: SocialAuthOptions): string {
  const clientOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || clientOrigin

  const url = new URL(`/oauth2/authorization/${provider}`, apiBaseUrl)
  url.searchParams.set('role', role)

  return url.toString()
}

function buildMockSocialAuthUrl({
  intent,
  provider,
  role,
}: SocialAuthOptions): string {
  const clientOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost'

  if (intent === 'login') {
    const callbackUrl = new URL('/oauth/callback', clientOrigin)
    callbackUrl.searchParams.set(
      'access_token',
      `mock-${provider}-${role.toLowerCase()}-access-token`,
    )
    return callbackUrl.toString()
  }

  const callbackUrl = new URL('/oauth/signup', clientOrigin)
  callbackUrl.searchParams.set('tempKey', `mock-${provider}-temp-key`)
  callbackUrl.searchParams.set('provider', provider)
  callbackUrl.searchParams.set('role', role)
  callbackUrl.searchParams.set('email', `${provider}@example.com`)
  callbackUrl.searchParams.set(
    'name',
    provider === 'google' ? 'Google 사용자' : '카카오 사용자',
  )
  callbackUrl.searchParams.set(
    'nickname',
    provider === 'google' ? 'google_user' : 'kakao_user',
  )

  return callbackUrl.toString()
}

export function startSocialAuth(options: SocialAuthOptions): void {
  persistOAuthIntendedRole(options.role)

  if (import.meta.env.VITE_MSW_ENABLED === 'true') {
    window.location.assign(buildMockSocialAuthUrl(options))
    return
  }

  window.location.assign(buildSocialAuthUrl(options))
}
