import {
  createMockWorkspace,
  findMockAccountByEmail,
  getMockUserByRole,
  getMockUserFromAccessToken,
  issueMockAccessToken,
  mockWorkspaceList,
  registerMockAccount,
  resetMockAuthState,
  resetMockWorkspaceState,
} from '@/mocks/fixtures'

describe('mock auth fixtures', () => {
  beforeEach(() => {
    resetMockAuthState()
    resetMockWorkspaceState()
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

  test('새 mock workspace를 생성하면 목록 앞에 추가되고 초기화할 수 있다', () => {
    const initialLength = mockWorkspaceList.length

    const createdWorkspace = createMockWorkspace({
      name: '새 스페이스',
      description: '새로운 스페이스 설명',
      mentorName: '김강사 강사',
    })

    expect(mockWorkspaceList).toHaveLength(initialLength + 1)
    expect(mockWorkspaceList[0]?.id).toBe(createdWorkspace.id)
    expect(mockWorkspaceList[0]?.name).toBe('새 스페이스')
    expect(mockWorkspaceList[0]?.mentor_name).toBe('김강사 강사')

    resetMockWorkspaceState()

    expect(mockWorkspaceList).toHaveLength(initialLength)
    expect(mockWorkspaceList.some((workspace) => workspace.id === createdWorkspace.id)).toBe(
      false,
    )
  })
})
