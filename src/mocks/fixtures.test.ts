import {
  findMockAccountByEmail,
  getMockUserByRole,
  getMockUserFromAccessToken,
  issueMockAccessToken,
  registerMockAccount,
  resetMockAuthState,
} from '@/mocks/fixtures'

describe('mock auth fixtures', () => {
  beforeEach(() => {
    resetMockAuthState()
  })

  test('role에 따라 mock user를 반환한다', () => {
    expect(getMockUserByRole('STUDENT').role).toBe('STUDENT')
    expect(getMockUserByRole('MENTOR').role).toBe('MENTOR')
  })

  test('소셜 로그인 mock access token에서 role을 해석한다', () => {
    expect(getMockUserFromAccessToken('mock-kakao-mentor-access-token').role).toBe(
      'MENTOR',
    )
    expect(getMockUserFromAccessToken('mock-google-student-access-token').role).toBe(
      'STUDENT',
    )
    expect(getMockUserFromAccessToken(null).role).toBe('STUDENT')
  })

  test('회원가입된 mock 계정은 이후 로그인/조회에 사용할 수 있다', () => {
    const createdUser = registerMockAccount({
      email: 'new-user@example.com',
      password: 'password123',
      name: '새 사용자',
      nickname: 'new_user',
      role: 'MENTOR',
    })

    const account = findMockAccountByEmail('new-user@example.com')

    expect(account?.password).toBe('password123')
    expect(account?.user.email).toBe('new-user@example.com')

    const accessToken = issueMockAccessToken(createdUser)
    expect(getMockUserFromAccessToken(accessToken).email).toBe(
      'new-user@example.com',
    )
    expect(getMockUserFromAccessToken(accessToken).role).toBe('MENTOR')
  })
})
