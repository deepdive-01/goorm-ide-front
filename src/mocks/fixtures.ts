import type { UserRole } from '@/types/api.type'
import type { UserInfo } from '@/types/user.type'
import type { WorkspaceListItem } from '@/types/workspace.type'

// MSW에서 재사용하는 공통 fixture와, 인증 흐름을 흉내 내기 위한 in-memory 상태 저장소입니다.

// 개발 편의를 위해 앱 첫 진입 시 mock 로그인 상태로 시작할지 결정합니다.
export const MOCK_IS_LOGGED_IN = false

if (import.meta.env.VITE_MSW_ENABLED === 'true') {
  if (MOCK_IS_LOGGED_IN) {
    localStorage.setItem('access_token', 'mock-access-token')
  } else {
    localStorage.removeItem('access_token')
  }
}

// 인증/권한 분기에서 공통으로 쓰는 기본 학생/강사 사용자 fixture입니다.
export const mockStudentUser: UserInfo = {
  id: 1,
  email: 'test@example.com',
  name: '최유정',
  nickname: '최유정',
  role: 'STUDENT' as const,
  profile_image_url: null as string | null,
  created_at: '2025-05-11T13:00:00Z',
}

export const mockMentorUser: UserInfo = {
  id: 2,
  email: 'mentor@example.com',
  name: '김강사',
  nickname: '김강사',
  role: 'MENTOR',
  profile_image_url: null,
  created_at: '2025-05-11T13:00:00Z',
}

// 기존 fixture들이 학생 기준 데이터를 참조하고 있어 남겨둔 하위 호환 alias입니다.
export const mockUser = mockStudentUser

export function getMockUserByRole(role: UserRole): UserInfo {
  return role === 'MENTOR' ? mockMentorUser : mockStudentUser
}

// 이메일 로그인/회원가입 mock이 사용하는 최소 계정 저장 구조입니다.
interface MockAuthAccount {
  password: string
  user: UserInfo
}

// 테스트/개발 시작 시 기본으로 존재하는 mock 계정들입니다.
const INITIAL_MOCK_AUTH_ACCOUNTS: Record<string, MockAuthAccount> = {
  'student@example.com': {
    password: 'password123',
    user: mockStudentUser,
  },
  'mentor@example.com': {
    password: 'password123',
    user: mockMentorUser,
  },
}

let mockAuthAccounts: Record<string, MockAuthAccount> = {}
let issuedAccessTokenUsers = new Map<string, UserInfo>()
let nextMockUserId = 3

function cloneUser(user: UserInfo): UserInfo {
  return { ...user }
}

// 테스트 간 상태가 섞이지 않도록 mock 계정 저장소와 발급 토큰 상태를 초기화합니다.
export function resetMockAuthState(): void {
  mockAuthAccounts = Object.fromEntries(
    Object.entries(INITIAL_MOCK_AUTH_ACCOUNTS).map(([email, account]) => [
      email,
      {
        password: account.password,
        user: cloneUser(account.user),
      },
    ]),
  )
  issuedAccessTokenUsers = new Map<string, UserInfo>()
  nextMockUserId = 3
}

resetMockAuthState()

export function findMockAccountByEmail(email: string): MockAuthAccount | null {
  return mockAuthAccounts[email] ?? null
}

export function isMockEmailTaken(email: string): boolean {
  return email in mockAuthAccounts
}

// 이메일 회원가입/소셜 추가가입 후 로그인까지 이어지도록 새 mock 계정을 메모리에 등록합니다.
export function registerMockAccount(params: {
  email: string
  name: string
  nickname: string
  password: string
  role: UserRole
}): UserInfo {
  const user: UserInfo = {
    id: nextMockUserId,
    email: params.email,
    name: params.name,
    nickname: params.nickname,
    role: params.role,
    profile_image_url: null,
    created_at: new Date().toISOString(),
  }

  nextMockUserId += 1
  mockAuthAccounts[params.email] = {
    password: params.password,
    user,
  }

  return cloneUser(user)
}

// 발급한 mock access token과 사용자를 연결해 이후 /users/me 응답에서 복원할 수 있게 합니다.
export function issueMockAccessToken(
  user: UserInfo,
  tokenPrefix = 'mock-access-token',
): string {
  const accessToken = `${tokenPrefix}-${user.role.toLowerCase()}-${user.id}`
  issuedAccessTokenUsers.set(accessToken, cloneUser(user))
  return accessToken
}

// Authorization 헤더의 mock token으로 현재 사용자를 복원합니다.
// 최근 발급된 토큰이 있으면 그 사용자를 우선 사용하고, 없으면 문자열 규칙으로 fallback 합니다.
export function getMockUserFromAccessToken(
  accessToken: string | null | undefined,
): UserInfo {
  if (accessToken) {
    const issuedUser = issuedAccessTokenUsers.get(accessToken)

    if (issuedUser) {
      return cloneUser(issuedUser)
    }
  }

  if (accessToken?.toLowerCase().includes('mentor')) {
    return mockMentorUser
  }

  return mockStudentUser
}

// 아래부터는 인증 외 화면에서 재사용하는 정적 도메인 fixture입니다.
export const mockWorkspace = {
  id: 1,
  name: '파이썬 기초 클래스',
  description:
    '파이썬의 기초 문법과 변수, 제어문 등 프로그래밍의 핵심 개념을 익히고, 간단한 알고리즘 문제를 풀며 실력을 다지는 클래스입니다.',
  is_public: false,
  invite_code: '152436',
  is_active: true,
  mentor: { id: 2, nickname: '엄성현' },
  member_count: 25,
  created_at: '2025-05-11T13:00:00Z',
}

const INITIAL_MOCK_WORKSPACE_LIST: WorkspaceListItem[] = [
  {
    id: 1,
    name: '파이썬 기초 클래스',
    description:
      '파이썬 기초 문법부터 자료구조까지, 프로그래밍의 기초를 탄탄히 다지는 클래스입니다.',
    member_count: 25,
    is_active: true,
    created_at: '2025-05-11T13:00:00Z',
    mentor_name: '엄성현 강사',
    problem_count: 12,
    lecture_count: 12,
  },
  {
    id: 2,
    name: '알고리즘 심화',
    description:
      '정렬, 탐색, 그래프 등 핵심 알고리즘을 문제 풀이 중심으로 학습합니다.',
    member_count: 18,
    is_active: true,
    created_at: '2025-05-12T10:00:00Z',
    mentor_name: '안건호 강사',
    problem_count: 20,
    lecture_count: 15,
  },
  {
    id: 3,
    name: '웹 개발 입문',
    description:
      'HTML, CSS, JavaScript로 반응형 웹 페이지를 직접 만들어 봅니다.',
    member_count: 32,
    is_active: true,
    created_at: '2025-05-13T09:00:00Z',
    mentor_name: '박강사',
    problem_count: 10,
    lecture_count: 8,
  },
  {
    id: 4,
    name: '데이터베이스 설계',
    description: 'ERD 설계와 SQL 실습을 통해 데이터 모델링 기초를 익힙니다.',
    member_count: 14,
    is_active: true,
    created_at: '2025-05-14T09:00:00Z',
    mentor_name: '최강사',
    problem_count: 8,
    lecture_count: 6,
  },
  {
    id: 5,
    name: '자바스크립트 실전',
    description: 'DOM 조작과 비동기 처리로 실무형 프론트엔드 기초를 다집니다.',
    member_count: 21,
    is_active: true,
    created_at: '2025-05-15T09:00:00Z',
    mentor_name: '이강사',
    problem_count: 15,
    lecture_count: 10,
  },
]

export let mockWorkspaceList: WorkspaceListItem[] = []
let nextMockWorkspaceId = 1

function cloneWorkspaceListItem(
  workspace: WorkspaceListItem,
): WorkspaceListItem {
  return { ...workspace }
}

export function resetMockWorkspaceState(): void {
  mockWorkspaceList = INITIAL_MOCK_WORKSPACE_LIST.map(cloneWorkspaceListItem)
  nextMockWorkspaceId =
    INITIAL_MOCK_WORKSPACE_LIST.reduce((maxId, workspace) => {
      return Math.max(maxId, workspace.id)
    }, 0) + 1
}

export function createMockWorkspace(params: {
  name: string
  description?: string
  mentorName?: string
}): WorkspaceListItem {
  const createdWorkspace: WorkspaceListItem = {
    id: nextMockWorkspaceId,
    name: params.name,
    description: params.description ?? '',
    member_count: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    mentor_name: params.mentorName ?? `${mockMentorUser.nickname} 강사`,
    problem_count: 0,
    lecture_count: 0,
  }

  nextMockWorkspaceId += 1
  mockWorkspaceList = [createdWorkspace, ...mockWorkspaceList]

  return cloneWorkspaceListItem(createdWorkspace)
}

resetMockWorkspaceState()

export const mockMembers = [
  {
    user_id: mockUser.id,
    nickname: mockUser.nickname,
    profile_image_url: mockUser.profile_image_url,
    joined_at: '2025-05-11T13:00:00Z',
  },
]

export const mockProblemBank = {
  id: 1,
  title: '두 수의 합',
  description: '두 정수 a, b가 주어질 때 합을 출력하시오.',
  difficulty: 'EASY' as const,
  language: 'PYTHON' as const,
  starter_code: 'def solution(a, b):\n    pass',
  source_type: 'ORIGINAL',
  source_url: null as string | null,
  testcases: [
    {
      id: 1,
      input: '1 2',
      expected_output: '3',
      is_hidden: false,
      order_num: 0,
    },
  ],
  created_at: '2025-05-11T13:00:00Z',
}

export const mockProblemSum = {
  id: 1,
  space_id: mockWorkspace.id,
  created_by: mockWorkspace.mentor.id,
  problem_bank_id: null as number | null,
  title: '두 수의 합',
  description:
    '두 정수 `a`, `b`가 주어졌을 때, `a`와 `b`의 합을 반환하는 함수를 작성하세요.',
  difficulty: 'EASY' as const,
  language: 'PYTHON' as const,
  starter_code: `# 두 수를 입력받아 합을 출력하세요
a, b = map(int, input().split())
# 여기에 코드를 작성하세요
print(a + b)`,
  is_published: true,
  testcases: [
    {
      id: 1,
      input: '3 5',
      expected_output: '8',
      is_hidden: false,
      order_num: 0,
    },
    {
      id: 2,
      input: '10 20',
      expected_output: '30',
      is_hidden: false,
      order_num: 1,
    },
    {
      id: 3,
      input: '0 0',
      expected_output: '0',
      is_hidden: true,
      order_num: 2,
    },
  ],
  created_at: '2025-05-11T13:00:00Z',
  updated_at: '2025-05-11T13:00:00Z',
}

export const mockProblemFibonacci = {
  id: 2,
  space_id: mockWorkspace.id,
  created_by: mockWorkspace.mentor.id,
  problem_bank_id: null as number | null,
  title: '피보나치 수열',
  description: 'n번째 피보나치 수를 출력하시오.',
  difficulty: 'MEDIUM' as const,
  language: 'PYTHON' as const,
  starter_code: 'def fibonacci(n):\n    pass',
  is_published: true,
  testcases: [
    { id: 1, input: '5', expected_output: '5', is_hidden: false, order_num: 0 },
  ],
  created_at: '2025-05-12T10:00:00Z',
  updated_at: '2025-05-12T10:00:00Z',
}

export const mockProblemBinarySearch = {
  id: 3,
  space_id: mockWorkspace.id,
  created_by: mockWorkspace.mentor.id,
  problem_bank_id: null as number | null,
  title: '이진 탐색 구현',
  description: '정렬된 배열에서 target의 인덱스를 찾으세요.',
  difficulty: 'MEDIUM' as const,
  language: 'PYTHON' as const,
  starter_code: 'def binary_search(nums, target):\n    pass',
  is_published: true,
  testcases: [
    {
      id: 1,
      input: '5\n1 2 3 4 5',
      expected_output: '2',
      is_hidden: false,
      order_num: 0,
    },
  ],
  created_at: '2025-05-13T09:00:00Z',
  updated_at: '2025-05-13T09:00:00Z',
}

export const mockProblemsById = {
  1: mockProblemSum,
  2: mockProblemFibonacci,
  3: mockProblemBinarySearch,
} as const

export const mockProblem = mockProblemSum

/** MSW·목 UI — submission_status, testcase_count는 API 스펙 확정 전 목 데이터 */
export const mockProblemList = [
  {
    id: 1,
    title: '두 수의 합',
    difficulty: 'EASY' as const,
    language: 'PYTHON' as const,
    is_published: true,
    created_at: '2025-05-11T13:00:00Z',
    submission_status: 'COMPLETED' as const,
    testcase_count: 3,
  },
  {
    id: 2,
    title: '피보나치 수열',
    difficulty: 'MEDIUM' as const,
    language: 'PYTHON' as const,
    is_published: true,
    created_at: '2025-05-12T10:00:00Z',
    submission_status: 'SUBMITTED' as const,
    testcase_count: 4,
  },
  {
    id: 3,
    title: '이진 탐색 구현',
    difficulty: 'MEDIUM' as const,
    language: 'PYTHON' as const,
    is_published: true,
    created_at: '2025-05-13T09:00:00Z',
    submission_status: 'NOT_SUBMITTED' as const,
    testcase_count: 5,
  },
]

export const mockNotification = {
  id: 1,
  type: 'FEEDBACK_RECEIVED' as const,
  content: `${mockWorkspace.mentor.nickname}님이 피드백을 남겼습니다.`,
  isRead: false,
  createdAt: '2025-05-11T13:00:00Z',
}

export const mockNotifications = [
  {
    id: 1,
    type: 'FEEDBACK_RECEIVED' as const,
    content: `${mockWorkspace.mentor.nickname}님이 피드백을 남겼습니다.`,
    isRead: false,
    createdAt: '2026-05-25T10:30:00Z',
  },
  {
    id: 2,
    type: 'WORKSPACE_INVITED' as const,
    content: 'codeRun 워크스페이스에 초대됐습니다.',
    isRead: true,
    createdAt: '2026-05-25T09:00:00Z',
  },
  {
    id: 3,
    type: 'SUBMISSION_RECEIVED' as const,
    content: `${mockWorkspace.name}에서 새 제출물이 있습니다.`,
    isRead: false,
    createdAt: '2026-05-22T13:00:00Z',
  },
  {
    id: 4,
    type: 'FEEDBACK_RECEIVED' as const,
    content: '이전 과제에 대한 피드백이 도착했습니다.',
    isRead: true,
    createdAt: '2026-05-18T13:00:00Z',
  },
  {
    id: 5,
    type: 'WORKSPACE_INVITED' as const,
    content: 'goorm IDE 워크스페이스에 초대됐습니다.',
    isRead: true,
    createdAt: '2026-05-11T13:00:00Z',
  },
  {
    id: 6,
    type: 'SUBMISSION_RECEIVED' as const,
    content: '알고리즘 과제 제출이 완료됐습니다.',
    isRead: true,
    createdAt: '2026-05-04T13:00:00Z',
  },
]

export const mockFeedback = {
  feedback_id: 1,
  submission_id: 1,
  type: 'COMMENT' as const,
  content: '잘 작성했습니다.',
  created_by: mockWorkspace.mentor.nickname,
  created_at: '2025-05-11T13:00:00Z',
}

export const mockTimer = {
  timer_id: 1,
  room_id: 1,
  duration_seconds: 1800,
  remaining_seconds: 900,
  started_at: '2025-05-11T13:00:00Z',
  expires_at: '2025-05-11T13:30:00Z',
  status: 'RUNNING' as const,
}

export const mockCodeExecution = {
  status: 200,
  code: 'SUCCESS',
  message: '코드 실행 성공',
  data: {
    stdout: '8\n4\n',
    stderr: '',
    exitCode: 0,
    executionTime: 0.123,
  },
}

export const mockTestCases = [
  { input: '3 5', expectedOutput: '8' },
  { input: '-3 7', expectedOutput: '4' },
]

export const mockSubmission = {
  submission_id: 1,
  student_id: mockUser.id,
  nickname: mockUser.nickname,
  status: 'SUBMITTED' as const,
  submitted_at: '2025-05-11T13:00:00Z',
  has_feedback: false,
}

// 강사 스페이스 제출 목록
export const mockTeacherSpaceSubmissions = [
  {
    id: 1,
    studentNickname: '최학생',
    problemTitle: '두 수의 합',
    submittedAt: '2026-05-14T18:00:00Z',
    feedbackStatus: 'PENDING' as const,
    commentCount: 1,
  },
  {
    id: 2,
    studentNickname: '정학생',
    problemTitle: '두 수의 합',
    submittedAt: '2026-05-06T09:15:00Z',
    feedbackStatus: 'COMPLETED' as const,
    commentCount: 1,
  },
]
