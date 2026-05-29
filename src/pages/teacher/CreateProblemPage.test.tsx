import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWorkspace } from '@/hooks/useWorkspace'
import { renderWithRouter } from '@/tests/utils'
import CreateProblemPage from './CreateProblemPage'

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}))

vi.mock('@/components/Editor/CodeEditor', () => ({
  default: () => <div data-testid="code-editor" />,
}))

describe('CreateProblemPage', () => {
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
        description: '파이썬 프로그래밍의 기초를 배우는 클래스입니다.',
        mentor: { id: 1, nickname: '엄성현' },
        invite_code: 'ABC12345',
        member_count: 25,
        is_public: false,
        is_active: true,
        created_at: '2025-05-11T13:00:00Z',
      },
      isLoading: false,
    })
  })

  test('문항 생성 화면을 렌더링한다', () => {
    renderWithRouter(
      <Routes>
        <Route
          path="/teacher/spaces/:spaceId/problems-create"
          element={<CreateProblemPage />}
        />
      </Routes>,
      { route: '/teacher/spaces/1/problems-create' },
    )

    expect(screen.getByRole('heading', { name: '새 문항 만들기' })).toBeInTheDocument()
    expect(screen.getByText('파이썬 기초 클래스')).toBeInTheDocument()
    expect(screen.getByLabelText('문항 제목')).toBeInTheDocument()
    expect(screen.getByText('테스트 케이스 1')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()
  })

  test('테스트 케이스를 추가하고 삭제할 수 있다', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Routes>
        <Route
          path="/teacher/spaces/:spaceId/problems-create"
          element={<CreateProblemPage />}
        />
      </Routes>,
      { route: '/teacher/spaces/1/problems-create' },
    )

    await user.click(screen.getByRole('button', { name: '추가' }))
    expect(screen.getByText('테스트 케이스 2')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '테스트 케이스 2 삭제' }))
    expect(screen.queryByText('테스트 케이스 2')).not.toBeInTheDocument()
    expect(screen.getByText('테스트 케이스 1')).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: '테스트 케이스 1 삭제' }),
    ).not.toBeInTheDocument()
  })
})
