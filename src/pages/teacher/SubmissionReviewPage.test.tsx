import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblem } from '@/hooks/useProblem'
import { useWorkspace } from '@/hooks/useWorkspace'
import { mockProblemSum } from '@/mocks/fixtures'
import { renderWithRouter } from '@/tests/utils'
import SubmissionReviewPage from './SubmissionReviewPage'

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}))

vi.mock('@/hooks/useProblem', () => ({
  useProblem: vi.fn(),
}))

vi.mock('@monaco-editor/react', () => ({
  default: () => <div data-testid="monaco-editor" />,
}))

describe('SubmissionReviewPage', () => {
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
        description: '파이썬 기초',
        mentor: { id: 1, nickname: '엄성현' },
        invite_code: 'ABC12345',
        member_count: 25,
        is_public: false,
        is_active: true,
        created_at: '2025-05-11T13:00:00Z',
      },
      isLoading: false,
      error: null,
    })

    vi.mocked(useProblem).mockReturnValue({
      problem: mockProblemSum,
      isLoading: false,
    })
  })

  test('강사 제출 리뷰 화면을 렌더링한다', () => {
    renderWithRouter(
      <Routes>
        <Route
          path="/teacher/spaces/:spaceId/submissions/:submissionId"
          element={<SubmissionReviewPage />}
        />
      </Routes>,
      { route: '/teacher/spaces/1/submissions/1' },
    )

    expect(screen.getByRole('heading', { name: '최학생의 제출' })).toBeInTheDocument()
    expect(screen.getByText('학생 코드')).toBeInTheDocument()
    expect(screen.getByText('코드 코멘트')).toBeInTheDocument()
    expect(screen.getByText('전체 피드백')).toBeInTheDocument()
    expect(screen.getByText('문제 설명')).toBeInTheDocument()
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument()
  })

  test('코드 코멘트를 삭제할 수 있다', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Routes>
        <Route
          path="/teacher/spaces/:spaceId/submissions/:submissionId"
          element={<SubmissionReviewPage />}
        />
      </Routes>,
      { route: '/teacher/spaces/1/submissions/1' },
    )

    expect(screen.getByText('map 함수를 사용해 깔끔하게 처리했네요!')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '코멘트 삭제' }))

    expect(
      screen.queryByText('map 함수를 사용해 깔끔하게 처리했네요!'),
    ).not.toBeInTheDocument()
  })
})
