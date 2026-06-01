import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/react'
import { createAxiosResponse, renderWithRouter } from '@/tests/utils'
import { createAxiosError } from '@/tests/authTestUtils'
import { oauthSignup } from '@/services/auth'
import { getMe } from '@/services/user'
import AdditionalInfoPage from './AdditionalInfoPage'

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
  oauthSignup: vi.fn(),
}))

vi.mock('@/services/user', () => ({
  getMe: vi.fn(),
}))

describe('AdditionalInfoPage', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    vi.mocked(oauthSignup).mockReset()
    vi.mocked(getMe).mockReset()
    localStorage.clear()
    sessionStorage.clear()
  })

  test('추가 정보를 제출하면 소셜 회원가입을 완료하고 역할별 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    vi.mocked(oauthSignup).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '회원가입이 완료되었습니다.',
        data: {
          access_token: 'oauth-mentor-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }),
    )
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'social@example.com',
          name: '소셜 사용자',
          nickname: 'social_user',
          role: 'MENTOR',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<AdditionalInfoPage />, {
      route:
        '/oauth/signup?provider=google&tempKey=valid-temp-key&email=social@example.com&name=%EC%86%8C%EC%85%9C%20%EC%82%AC%EC%9A%A9%EC%9E%90&nickname=social_user&role=MENTOR',
    })

    expect(screen.getByLabelText('이름')).toHaveValue('소셜 사용자')
    expect(screen.getByLabelText('닉네임')).toHaveValue('social_user')
    expect(screen.getByLabelText('이메일')).toHaveValue('social@example.com')

    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    await waitFor(() => {
      expect(oauthSignup).toHaveBeenCalledWith({
        temp_key: 'valid-temp-key',
        email: 'social@example.com',
        name: '소셜 사용자',
        nickname: 'social_user',
        role: 'MENTOR',
      })
    })

    expect(localStorage.getItem('access_token')).toBe('oauth-mentor-token')
    expect(mockedNavigate).toHaveBeenCalledWith('/teacher/spaces')
  })

  test('role 쿼리 없이 접근하면 sessionStorage에 저장된 역할을 사용한다', async () => {
    const user = userEvent.setup()
    sessionStorage.setItem('oauth_intended_role', 'MENTOR')

    vi.mocked(oauthSignup).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '회원가입이 완료되었습니다.',
        data: {
          access_token: 'oauth-mentor-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }),
    )
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'kakao@example.com',
          name: '카카오 사용자',
          nickname: 'kakao_user',
          role: 'MENTOR',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<AdditionalInfoPage />, {
      route:
        '/oauth/signup?provider=kakao&tempKey=valid-temp-key&email=kakao@example.com',
    })

    await user.type(screen.getByLabelText('이름'), '카카오 사용자')
    await user.type(screen.getByLabelText('닉네임'), 'kakao_user')
    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    await waitFor(() => {
      expect(oauthSignup).toHaveBeenCalledWith({
        temp_key: 'valid-temp-key',
        email: 'kakao@example.com',
        name: '카카오 사용자',
        nickname: 'kakao_user',
        role: 'MENTOR',
      })
    })
  })

  test('학생 역할로 소셜 가입을 완료하면 학생 화면으로 이동한다', async () => {
    const user = userEvent.setup()
    vi.mocked(oauthSignup).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '회원가입이 완료되었습니다.',
        data: {
          access_token: 'oauth-student-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }),
    )
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'student@example.com',
          name: '학생',
          nickname: 'student_user',
          role: 'STUDENT',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<AdditionalInfoPage />, {
      route:
        '/oauth/signup?provider=google&tempKey=valid-temp-key&email=student@example.com&role=STUDENT',
    })

    await user.type(screen.getByLabelText('이름'), '학생')
    await user.type(screen.getByLabelText('닉네임'), 'student_user')
    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/student/spaces')
    })
  })

  test('가입 후 역할 불일치면 에러를 보여준다', async () => {
    const user = userEvent.setup()
    vi.mocked(oauthSignup).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '회원가입이 완료되었습니다.',
        data: {
          access_token: 'oauth-token',
          token_type: 'Bearer',
          expires_in: 3600,
        },
      }),
    )
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'social@example.com',
          name: '소셜 사용자',
          nickname: 'social_user',
          role: 'STUDENT',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<AdditionalInfoPage />, {
      route:
        '/oauth/signup?provider=google&tempKey=valid-temp-key&email=social@example.com&role=MENTOR',
    })

    await user.type(screen.getByLabelText('이름'), '소셜 사용자')
    await user.type(screen.getByLabelText('닉네임'), 'social_user')
    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '선택한 사용자 유형이 올바르지 않습니다',
    )
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(mockedNavigate).not.toHaveBeenCalled()
  })

  test('필수 입력값 검증에 실패하면 제출을 막는다', async () => {
    const user = userEvent.setup()

    renderWithRouter(<AdditionalInfoPage />, {
      route: '/oauth/signup?provider=kakao&tempKey=valid-temp-key',
    })

    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이름을 입력해주세요',
    )
    expect(oauthSignup).not.toHaveBeenCalled()
  })

  test('temp_key 없이 접근하면 제출을 막는다', async () => {
    const user = userEvent.setup()

    renderWithRouter(<AdditionalInfoPage />, {
      route: '/oauth/signup?provider=kakao',
    })

    await user.type(screen.getByLabelText('이름'), '카카오 사용자')
    await user.type(screen.getByLabelText('닉네임'), 'kakao_user')
    await user.type(screen.getByLabelText('이메일'), 'kakao@example.com')
    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '유효하지 않은 가입 요청입니다. 다시 소셜 로그인을 시도해 주세요.',
    )
    expect(oauthSignup).not.toHaveBeenCalled()
  })

  test('이미 가입된 이메일이면 로그인 안내 메시지를 보여준다', async () => {
    const user = userEvent.setup()
    vi.mocked(oauthSignup).mockRejectedValue(
      createAxiosError(409, 'AUTH_EMAIL_ALREADY_EXISTS'),
    )

    renderWithRouter(<AdditionalInfoPage />, {
      route:
        '/oauth/signup?provider=google&tempKey=valid-temp-key&email=duplicate@example.com',
    })

    await user.type(screen.getByLabelText('이름'), '소셜 사용자')
    await user.type(screen.getByLabelText('닉네임'), 'social_user')
    await user.click(screen.getByRole('button', { name: '가입 완료' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.',
    )
  })
})
