import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblems } from '@/hooks/useProblems'
import { useWorkspace } from '@/hooks/useWorkspace'
import { renderWithRouter } from '@/tests/utils'
import type { StudentProblemListItem } from '@/types/studentProblem.type'
import SpaceDetailPage from './SpaceDetailPage'

const mockTeacherProblems: StudentProblemListItem[] = [
  {
    id: 1,
    title: '두 수의 합',
    difficulty: 'EASY',
    language: 'PYTHON',
    is_published: true,
    created_at: '2025-05-11T13:00:00Z',
    testcase_count: 3,
  },
  {
    id: 2,
    title: '피보나치 수열',
    difficulty: 'MEDIUM',
    language: 'PYTHON',
    is_published: true,
    created_at: '2025-05-12T10:00:00Z',
    testcase_count: 4,
  },
]

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}))

vi.mock('@/hooks/useProblems', () => ({
  useProblems: vi.fn(),
}))

describe('SpaceDetailPage', () => {
  beforeEach(() => {
    vi.mocked(useCurrentUser).mockReturnValue({
      user: {
        id: 1,
        email: 'mentor@example.com',
        name: '엄성현',
        nickname: '엄성현',
        role: 'MENTOR',
        profile_image_url: null,
        created_at: '2025-05-11T13:00:00Z',
      },
      isLoading: false,
    })

    vi.mocked(useWorkspace).mockReturnValue({
      workspace: {
        id: 1,
        name: '파이썬 기초 클래스',
        description:
          '파이썬의 기초 문법과 변수, 제어문 등 프로그래밍의 핵심 개념을 익히는 클래스입니다.',
        mentor: { id: 1, nickname: '엄성현' },
        invite_code: 'ABC12345',
        member_count: 25,
        is_public: false,
        is_active: true,
        created_at: '2025-05-11T13:00:00Z',
      },
      isLoading: false,
    })

    vi.mocked(useProblems).mockReturnValue({
      problems: mockTeacherProblems,
      isLoading: false,
    })
  })

  test('교사용 스페이스 상세 화면을 렌더링한다', () => {
    renderWithRouter(
      <Routes>
        <Route path="/teacher/spaces/:spaceId" element={<SpaceDetailPage />} />
      </Routes>,
      { route: '/teacher/spaces/1' },
    )

    expect(
      screen.getByRole('heading', { name: '파이썬 기초 클래스' }),
    ).toBeInTheDocument()
    expect(screen.getByText('총 문항')).toBeInTheDocument()
    expect(screen.getByText('학습자')).toBeInTheDocument()
    expect(screen.getByText('대기 중')).toBeInTheDocument()
    expect(screen.getByText('피드백 완료')).toBeInTheDocument()
    expect(screen.getByText('피보나치 수열')).toBeInTheDocument()
    expect(screen.getByText('테스트 케이스 4개')).toBeInTheDocument()
  })

  test('제출 현황 탭으로 전환하면 학습자 제출 목록을 표시한다', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Routes>
        <Route path="/teacher/spaces/:spaceId" element={<SpaceDetailPage />} />
      </Routes>,
      { route: '/teacher/spaces/1' },
    )

    await user.click(screen.getByRole('tab', { name: '제출 현황' }))

    expect(screen.getByRole('heading', { name: '최학생' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: '정학생' })).toBeInTheDocument()
    expect(screen.getAllByText('댓글 1')).toHaveLength(2)
    expect(screen.queryByText('피보나치 수열')).not.toBeInTheDocument()
  })

  test('제출 카드를 클릭하면 제출 리뷰 화면으로 이동한다', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Routes>
        <Route path="/teacher/spaces/:spaceId" element={<SpaceDetailPage />} />
        <Route
          path="/teacher/spaces/:spaceId/submissions/:submissionId"
          element={<div>submission review</div>}
        />
      </Routes>,
      { route: '/teacher/spaces/1' },
    )

    await user.click(screen.getByRole('tab', { name: '제출 현황' }))
    await user.click(screen.getByRole('heading', { name: '최학생' }))

    expect(screen.getByText('submission review')).toBeInTheDocument()
  })
})
