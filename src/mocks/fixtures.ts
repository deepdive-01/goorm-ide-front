// 목업 데이터를 여기서 수정하면 모든 핸들러에 반영됩니다.

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
  name: '파이썬 기초 클래스',
  description:
    '파이썬의 기초 문법과 변수, 제어문 등 프로그래밍의 핵심 개념을 익히고, 간단한 알고리즘 문제를 풀며 실력을 다지는 클래스입니다.',
  is_public: false,
  invite_code: 'ABC12345',
  is_active: true,
  mentor: { id: 2, nickname: '엄성현' },
  member_count: 25,
  created_at: '2025-05-11T13:00:00Z',
}

export const mockWorkspaceList = [
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
