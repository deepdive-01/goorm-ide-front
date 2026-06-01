import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { createAxiosResponse, renderWithRouter } from '@/tests/utils'
import { createAxiosError } from '@/tests/authTestUtils'
import { login } from '@/services/auth'
import { getMe } from '@/services/user'
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

vi.mock('@/services/user', () => ({
  getMe: vi.fn(),
}))

function mockMe(role: 'STUDENT' | 'MENTOR', email: string) {
  vi.mocked(getMe).mockResolvedValue(
    createAxiosResponse({
      status: 200,
      code: 'SUCCESS',
      message: 'OK',
      data: {
        id: 1,
        email,
        name: role === 'MENTOR' ? '멘토' : '학생',
        nickname: role === 'MENTOR' ? '멘토' : '학생',
        role,
        profile_image_url: null,
        created_at: '2025-05-11T13:00:00Z',
      },
    }),
  )
}

function mockLoginToken(token: string) {
  vi.mocked(login).mockResolvedValue(
    createAxiosResponse({
      status: 200,
      code: 'SUCCESS',
      message: '로그인 성공',
      data: {
        access_token: token,
        token_type: 'Bearer',
        expires_in: 3600,
      },
    }),
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    vi.mocked(login).mockReset()
    vi.mocked(getMe).mockReset()
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

  test('학생 로그인 성공 시 학생 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    mockLoginToken('student-token')
    mockMe('STUDENT', 'student@example.com')

    renderWithRouter(<LoginPage />)

    await user.type(screen.getByLabelText('이메일'), 'student@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'Password1!')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/student/spaces')
    })
  })

  test('강사 로그인 성공 시 토큰을 저장하고 강사 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    mockLoginToken('mentor-token')
    mockMe('MENTOR', 'mentor@example.com')

    renderWithRouter(<LoginPage />)

    await user.click(screen.getByRole('button', { name: '강사' }))
    await user.type(screen.getByLabelText('이메일'), 'mentor@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'Password1!')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: 'mentor@example.com',
        password: 'Password1!',
        role: 'MENTOR',
      })
    })

    expect(localStorage.getItem('access_token')).toBe('mentor-token')
    expect(mockedNavigate).toHaveBeenCalledWith('/teacher/spaces')
  })

  test('역할 불일치 시 에러를 보여준다', async () => {
    const user = userEvent.setup()
    mockLoginToken('student-token')
    mockMe('STUDENT', 'user@example.com')

    renderWithRouter(<LoginPage />)

    await user.click(screen.getByRole('button', { name: '강사' }))
    await user.type(screen.getByLabelText('이메일'), 'user@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'Password1!')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '선택한 사용자 유형이 올바르지 않습니다',
    )
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(mockedNavigate).not.toHaveBeenCalled()
  })

  test('잘못된 비밀번호면 에러 메시지를 화면에 남긴다', async () => {
    const user = userEvent.setup()
    vi.mocked(login).mockRejectedValue(
      createAxiosError(401, 'INVALID_CREDENTIALS'),
    )

    renderWithRouter(<LoginPage />)

    await user.type(screen.getByLabelText('이메일'), 'mentor@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'WrongPass1!')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이메일 또는 비밀번호가 올바르지 않습니다',
    )
    expect(mockedNavigate).not.toHaveBeenCalled()
  })

  test('존재하지 않는 계정이면 안내 메시지를 보여준다', async () => {
    const user = userEvent.setup()
    vi.mocked(login).mockRejectedValue(createAxiosError(404, 'ACCOUNT_NOT_FOUND'))

    renderWithRouter(<LoginPage />)

    await user.type(screen.getByLabelText('이메일'), 'unknown@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'Password1!')
    await user.click(screen.getByRole('button', { name: '로그인' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '존재하지 않는 계정입니다. 회원가입을 진행해주세요.',
    )
  })

  test('OAuth 역할 불일치 쿼리면 안내 메시지를 보여준다', () => {
    renderWithRouter(<LoginPage />, {
      route: '/login?error=oauth_role_mismatch',
    })

    expect(screen.getByRole('alert')).toHaveTextContent(
      '선택한 사용자 유형이 올바르지 않습니다',
    )
  })
})
