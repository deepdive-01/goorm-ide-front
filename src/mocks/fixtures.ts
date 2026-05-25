// 목업 데이터를 여기서 수정하면 모든 핸들러에 반영됩니다.
import { hoursAgo } from '@/utils/formatRelativeTime'

// true: 로그인 상태로 시작 / false: 비로그인 상태로 시작
export const MOCK_IS_LOGGED_IN = true

if (MOCK_IS_LOGGED_IN) {
  localStorage.setItem('access_token', 'mock-access-token')
} else {
  localStorage.removeItem('access_token')
}

export const mockUser = {
  id: 1,
  email: 'test@example.com',
  name: '최유정',
  nickname: '최유정',
  role: 'STUDENT' as const,
  profile_image_url: null as string | null,
  created_at: '2025-05-11T13:00:00Z',
}

export const mockWorkspace = {
  id: 1,
  name: '테스트 워크스페이스',
  description: '테스트 설명',
  is_public: false,
  invite_code: 'ABC12345',
  is_active: true,
  mentor: { id: 2, nickname: '강사1' },
  member_count: 3,
  created_at: '2025-05-11T13:00:00Z',
}

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

export const mockProblem = {
  id: 1,
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
  created_at: '2025-05-11T13:00:00Z',
  updated_at: '2025-05-11T13:00:00Z',
}

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
    createdAt: hoursAgo(0.5),
  },
  {
    id: 2,
    type: 'WORKSPACE_INVITED' as const,
    content: 'codeRun 워크스페이스에 초대됐습니다.',
    isRead: true,
    createdAt: hoursAgo(3),
  },
  {
    id: 3,
    type: 'SUBMISSION_RECEIVED' as const,
    content: `${mockWorkspace.name}에서 새 제출물이 있습니다.`,
    isRead: false,
    createdAt: hoursAgo(72),
  },
  {
    id: 4,
    type: 'FEEDBACK_RECEIVED' as const,
    content: '이전 과제에 대한 피드백이 도착했습니다.',
    isRead: true,
    createdAt: hoursAgo(168),
  },
  {
    id: 5,
    type: 'WORKSPACE_INVITED' as const,
    content: 'goorm IDE 워크스페이스에 초대됐습니다.',
    isRead: true,
    createdAt: hoursAgo(336),
  },
  {
    id: 6,
    type: 'SUBMISSION_RECEIVED' as const,
    content: '알고리즘 과제 제출이 완료됐습니다.',
    isRead: true,
    createdAt: hoursAgo(504),
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

export const mockSubmission = {
  submission_id: 1,
  student_id: mockUser.id,
  nickname: mockUser.nickname,
  status: 'SUBMITTED' as const,
  submitted_at: '2025-05-11T13:00:00Z',
  has_feedback: false,
}
