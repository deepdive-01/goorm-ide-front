import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useWorkspace } from '@/hooks/useWorkspace'
import { inviteByEmail } from '@/services/workspace'
import { renderWithRouter } from '@/tests/utils'
import InviteStudentsPage from './InviteStudentsPage'

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

vi.mock('@/hooks/useWorkspace', () => ({
  useWorkspace: vi.fn(),
}))

vi.mock('@/services/workspace', () => ({
  inviteByEmail: vi.fn(),
}))

describe('InviteStudentsPage', () => {
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

    vi.mocked(inviteByEmail).mockResolvedValue({
      data: { data: { sent_count: 1 } },
    } as Awaited<ReturnType<typeof inviteByEmail>>)

    vi.mocked(useWorkspace).mockReturnValue({
      workspace: {
        id: 1,
        name: '파이썬 기초 클래스',
        description: '파이썬 프로그래밍의 기초를 배우는 클래스입니다.',
        mentor: { id: 1, nickname: '엄성현' },
        invite_code: '152436',
        member_count: 25,
        is_public: false,
        is_active: true,
        created_at: '2025-05-11T13:00:00Z',
      },
      isLoading: false,
    })
  })

  test('학습자 초대 화면을 렌더링한다', () => {
    renderWithRouter(
      <Routes>
        <Route path="/teacher/spaces/:spaceId/invite" element={<InviteStudentsPage />} />
      </Routes>,
      { route: '/teacher/spaces/1/invite' },
    )

    expect(screen.getByRole('heading', { name: '학습자 초대' })).toBeInTheDocument()
    expect(screen.getByText('파이썬 기초 클래스')).toBeInTheDocument()
    expect(screen.getByText('152436')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '초대 보내기' })).toBeDisabled()
  })

  test('이메일을 추가하고 초대를 보낼 수 있다', async () => {
    const user = userEvent.setup()

    renderWithRouter(
      <Routes>
        <Route path="/teacher/spaces/:spaceId/invite" element={<InviteStudentsPage />} />
      </Routes>,
      { route: '/teacher/spaces/1/invite' },
    )

    await user.type(screen.getByLabelText('이메일'), 'student@example.com')
    await user.click(screen.getByRole('button', { name: '추가' }))
    expect(screen.getByText('student@example.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '초대 보내기' }))
    expect(await screen.findByRole('status')).toHaveTextContent('1명에게 초대 이메일을 보냈습니다.')
  })
})
