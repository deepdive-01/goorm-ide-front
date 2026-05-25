import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { createAxiosResponse, renderWithRouter } from '@/tests/utils'
import { login } from '@/services/auth'
import LoginPage from './LoginPage'

const mockedNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  }
})

vi.mock('@/services/auth', () => ({
  login: vi.fn(),
}))

function createAxiosError(status: number, code: string) {
  return {
    isAxiosError: true,
    response: {
      status,
      data: {
        code,
      },
    },
  }
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    vi.mocked(login).mockReset()
    localStorage.clear()
  })

  test('입력값 검증 실패 메시지를 보여준다', async () => {
    const user = userEvent.setup()

    renderWithRouter(<LoginPage />)

    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이메일을 입력해주세요',
    )
    expect(login).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText('이메일'), 'wrong-email')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      '올바른 이메일 형식이 아닙니다',
    )

    await user.clear(screen.getByLabelText('이메일'))
    await user.type(screen.getByLabelText('이메일'), 'user@example.com')
    await user.type(screen.getByLabelText('비밀번호'), '1234')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      '비밀번호는 8자 이상 입력해주세요',
    )
  })

  test('강사 로그인 성공 시 토큰을 저장하고 강사 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    vi.mocked(login).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '로그인 성공',
        data: {
          access_token: 'mentor-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }),
    )

    renderWithRouter(<LoginPage />)

    await user.click(screen.getByRole('button', { name: '강사' }))
    await user.type(screen.getByLabelText('이메일'), 'mentor@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'mentor@example.com',
        password: 'password123',
        role: 'MENTOR',
      })
    })

    expect(localStorage.getItem('access_token')).toBe('mentor-token')
    expect(mockedNavigate).toHaveBeenCalledWith('/teacher/spaces')
  })

  test('역할 불일치 에러를 사용자 메시지로 보여준다', async () => {
    const user = userEvent.setup()
    vi.mocked(login).mockRejectedValue(createAxiosError(403, 'AUTH_ROLE_MISMATCH'))

    renderWithRouter(<LoginPage />)

    await user.type(screen.getByLabelText('이메일'), 'wrong-role@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '선택한 사용자 유형이 올바르지 않습니다',
    )
    expect(mockedNavigate).not.toHaveBeenCalled()
  })
})
