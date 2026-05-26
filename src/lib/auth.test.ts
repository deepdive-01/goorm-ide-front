import {
  buildSocialAuthUrl,
  getRoleHomePath,
  validateEmail,
  validatePassword,
} from '@/lib/auth'

describe('auth utils', () => {
  const originalApiBaseUrl = import.meta.env.VITE_API_BASE_URL
  const originalMswEnabled = import.meta.env.VITE_MSW_ENABLED

  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    import.meta.env.VITE_API_BASE_URL = originalApiBaseUrl
    import.meta.env.VITE_MSW_ENABLED = originalMswEnabled
  })

  test('이메일과 비밀번호 검증 규칙을 적용한다', () => {
    expect(validateEmail('')).toBe('이메일을 입력해주세요')
    expect(validateEmail('invalid-email')).toBe('올바른 이메일 형식이 아닙니다')
    expect(validateEmail('valid@example.com')).toBeNull()

    expect(validatePassword('')).toBe('비밀번호를 입력해주세요')
    expect(validatePassword('1234567')).toBe('비밀번호는 8자 이상 입력해주세요')
    expect(validatePassword('password123')).toBeNull()
  })

  test('역할별 기본 진입 경로를 반환한다', () => {
    expect(getRoleHomePath('STUDENT')).toBe('/student/spaces')
    expect(getRoleHomePath('MENTOR')).toBe('/teacher/spaces')
  })

  test('실서비스 환경에서는 OAuth 시작 URL을 생성한다', () => {
    import.meta.env.VITE_API_BASE_URL = 'https://api.example.com'

    const url = new URL(
      buildSocialAuthUrl({
        intent: 'signup',
        provider: 'google',
        role: 'MENTOR',
      }),
    )

    expect(url.origin).toBe('https://api.example.com')
    expect(url.pathname).toBe('/oauth2/authorization/google')
    expect(url.search).toBe('')
  })

  test('로그인용 OAuth URL도 provider별 Spring Security 시작점을 사용한다', () => {
    import.meta.env.VITE_API_BASE_URL = 'https://api.example.com'

    const url = new URL(
      buildSocialAuthUrl({
        intent: 'login',
        provider: 'kakao',
        role: 'STUDENT',
      }),
    )

    expect(url.origin).toBe('https://api.example.com')
    expect(url.pathname).toBe('/oauth2/authorization/kakao')
    expect(url.search).toBe('')
  })
})
