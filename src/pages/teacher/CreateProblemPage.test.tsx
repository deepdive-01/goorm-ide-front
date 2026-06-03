import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWorkspace } from '@/hooks/useWorkspace'
import { createProblem } from '@/services/problem'
import { renderWithRouter } from '@/tests/utils'
import CreateProblemPage from './CreateProblemPage'

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}))

vi.mock('@/services/problem', () => ({
  createProblem: vi.fn(),
}))

vi.mock('@/components/Editor/CodeEditor', () => ({
  default: () => <div data-testid="code-editor" />,
}))

describe('CreateProblemPage', () => {
  beforeEach(() => {
    vi.mocked(createProblem).mockResolvedValue({
      data: {
        data: {
          id: 1,
          space_id: 1,
          created_by: 1,
          problem_bank_id: null,
          title: '제목',
          difficulty: 'EASY',
          language: 'PYTHON',
          is_published: false,
          created_at: '2025-05-11T13:00:00Z',
        },
      },
    } as Awaited<ReturnType<typeof createProblem>>)

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
      error: null,
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

  test('필수값이 비어 있으면 저장 시 검증 메시지를 표시한다', async () => {
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

    await user.click(screen.getByRole('button', { name: '저장' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('문항 제목을 입력해주세요')
    expect(createProblem).not.toHaveBeenCalled()
  })

  test('입력이 유효하면 문항 생성 API를 호출한다', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Routes>
        <Route
          path="/teacher/spaces/:spaceId/problems-create"
          element={<CreateProblemPage />}
        />
        <Route path="/teacher/spaces/:spaceId" element={<div>스페이스 상세</div>} />
      </Routes>,
      { route: '/teacher/spaces/1/problems-create' },
    )

    await user.type(screen.getByLabelText('문항 제목'), '두 수의 합')
    await user.type(screen.getByLabelText('문제 설명'), '두 수를 더하세요')
    await user.type(screen.getByPlaceholderText('입력값'), '1 2')
    await user.type(screen.getByPlaceholderText('예상 출력값'), '3')
    await user.click(screen.getByRole('button', { name: '저장' }))

    expect(createProblem).toHaveBeenCalledWith(
      1,
      1,
      expect.objectContaining({
        title: '두 수의 합',
        description: '두 수를 더하세요',
        language: 'PYTHON',
        testcases: [
          expect.objectContaining({
            input: '1 2',
            expected_output: '3',
          }),
        ],
      }),
    )
    expect(await screen.findByText('스페이스 상세')).toBeInTheDocument()
  })
})
