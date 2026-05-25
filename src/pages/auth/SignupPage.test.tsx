import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { createAxiosResponse, renderWithRouter } from '@/tests/utils'
import {
  login,
  sendEmailCode,
  signup,
  verifyEmailCode,
} from '@/services/auth'
import SignupPage from './SignupPage'

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
  signup: vi.fn(),
  login: vi.fn(),
  sendEmailCode: vi.fn(),
  verifyEmailCode: vi.fn(),
}))

describe('SignupPage', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    vi.mocked(signup).mockReset()
    vi.mocked(login).mockReset()
    vi.mocked(sendEmailCode).mockReset()
    vi.mocked(verifyEmailCode).mockReset()
    localStorage.clear()
  })

  test('이메일 인증 후 회원가입하면 자동 로그인한다', async () => {
    const user = userEvent.setup()
    vi.mocked(sendEmailCode).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'EMAIL_SEND_SUCCESS',
        message: '인증 코드가 발송됐습니다.',
        data: null,
      }),
    )
    vi.mocked(verifyEmailCode).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'EMAIL_VERIFY_SUCCESS',
        message: '이메일 인증이 완료됐습니다.',
        data: null,
      }),
    )
    vi.mocked(signup).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '회원가입이 완료되었습니다.',
        data: {
          id: 1,
          email: 'student@example.com',
          name: '홍길동',
          nickname: '길동이',
          role: 'STUDENT',
          created_at: new Date().toISOString(),
        },
      }),
    )
    vi.mocked(login).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '로그인 성공',
        data: {
          access_token: 'signup-login-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }),
    )

    renderWithRouter(<SignupPage />)

    await user.type(screen.getByLabelText('이름'), '홍길동')
    await user.type(screen.getByLabelText('닉네임'), '길동이')
    await user.type(screen.getByLabelText('이메일'), 'student@example.com')
    await user.click(screen.getByRole('button', { name: '인증하기' }))

    await waitFor(() => {
      expect(sendEmailCode).toHaveBeenCalledWith({
        email: 'student@example.com',
      })
    })
    expect(screen.getByText('인증코드를 발송했습니다. 메일함을 확인해주세요.')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('인증코드를 입력하세요'), '123456')
    await user.click(screen.getByRole('button', { name: '인증코드 확인' }))

    await waitFor(() => {
      expect(verifyEmailCode).toHaveBeenCalledWith({
        email: 'student@example.com',
        code: '123456',
      })
    })

    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        email: 'student@example.com',
        password: 'password123',
        name: '홍길동',
        nickname: '길동이',
        role: 'STUDENT',
      })
    })

    expect(login).toHaveBeenCalledWith({
      email: 'student@example.com',
      password: 'password123',
      role: 'STUDENT',
    })
    expect(localStorage.getItem('access_token')).toBe('signup-login-token')
    expect(mockedNavigate).toHaveBeenCalledWith('/student/spaces')
  })

  test('이메일 인증 없이 제출하면 가입을 막는다', async () => {
    const user = userEvent.setup()

    renderWithRouter(<SignupPage />)

    await user.type(screen.getByLabelText('이름'), '홍길동')
    await user.type(screen.getByLabelText('닉네임'), '길동이')
    await user.type(screen.getByLabelText('이메일'), 'student@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이메일 인증을 완료해주세요',
    )
    expect(signup).not.toHaveBeenCalled()
  })

  test('인증 완료 후 이메일을 바꾸면 다시 인증을 요구한다', async () => {
    const user = userEvent.setup()
    vi.mocked(sendEmailCode).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'EMAIL_SEND_SUCCESS',
        message: '인증 코드가 발송됐습니다.',
        data: null,
      }),
    )
    vi.mocked(verifyEmailCode).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'EMAIL_VERIFY_SUCCESS',
        message: '이메일 인증이 완료됐습니다.',
        data: null,
      }),
    )

    renderWithRouter(<SignupPage />)

    await user.type(screen.getByLabelText('이름'), '홍길동')
    await user.type(screen.getByLabelText('닉네임'), '길동이')
    await user.type(screen.getByLabelText('이메일'), 'student@example.com')
    await user.click(screen.getByRole('button', { name: '인증하기' }))
    await user.type(screen.getByPlaceholderText('인증코드를 입력하세요'), '123456')
    await user.click(screen.getByRole('button', { name: '인증코드 확인' }))

    expect(await screen.findByText('이메일 인증이 완료되었습니다.')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('이메일'))
    await user.type(screen.getByLabelText('이메일'), 'changed@example.com')
    await user.type(screen.getByLabelText('비밀번호'), 'password123')
    await user.type(screen.getByLabelText('비밀번호 확인'), 'password123')
    await user.click(screen.getByRole('button', { name: '회원가입' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이메일 인증을 완료해주세요',
    )
  })
})
