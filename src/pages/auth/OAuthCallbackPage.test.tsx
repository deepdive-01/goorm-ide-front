import { screen, waitFor } from '@testing-library/react'
import { createAxiosResponse, renderWithRouter } from '@/tests/utils'
import { getMe } from '@/services/user'
import OAuthCallbackPage from './OAuthCallbackPage'

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

vi.mock('@/services/user', () => ({
  getMe: vi.fn(),
}))

describe('OAuthCallbackPage', () => {
  beforeEach(() => {
    mockedNavigate.mockReset()
    vi.mocked(getMe).mockReset()
    localStorage.clear()
    sessionStorage.clear()
  })

  test('accessToken을 저장하고 사용자 정보를 조회한 뒤 역할별 화면으로 이동한다', async () => {
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'mentor@example.com',
          name: '강사',
          nickname: 'mentor',
          role: 'MENTOR',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<OAuthCallbackPage />, {
      route: '/oauth/callback?access_token=social-access-token',
    })

    await waitFor(() => {
      expect(getMe).toHaveBeenCalled()
    })

    expect(localStorage.getItem('access_token')).toBe('social-access-token')
    expect(mockedNavigate).toHaveBeenCalledWith('/teacher/spaces', {
      replace: true,
    })
  })

  test('학생 OAuth 콜백이면 학생 화면으로 이동한다', async () => {
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'student@example.com',
          name: '학생',
          nickname: 'student',
          role: 'STUDENT',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<OAuthCallbackPage />, {
      route: '/oauth/callback?access_token=student-social-token',
    })

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/student/spaces', {
        replace: true,
      })
    })
  })

  test('accessToken 쿼리(camelCase)도 지원한다', async () => {
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'mentor@example.com',
          name: '강사',
          nickname: 'mentor',
          role: 'MENTOR',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<OAuthCallbackPage />, {
      route: '/oauth/callback?accessToken=camel-case-token',
    })

    await waitFor(() => {
      expect(localStorage.getItem('access_token')).toBe('camel-case-token')
    })
  })

  test('getMe 실패 시 에러 메시지를 보여준다', async () => {
    vi.mocked(getMe).mockRejectedValue(new Error('network'))

    renderWithRouter(<OAuthCallbackPage />, {
      route: '/oauth/callback?access_token=social-access-token',
    })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '로그인 정보를 불러오지 못했습니다. 다시 로그인해주세요.',
    )
    expect(localStorage.getItem('access_token')).toBeNull()
  })

  test('accessToken이 없으면 에러 메시지를 보여준다', async () => {
    renderWithRouter(<OAuthCallbackPage />, {
      route: '/oauth/callback',
    })

    expect(await screen.findByRole('alert')).toHaveTextContent(
      '로그인 정보가 올바르지 않습니다. 다시 로그인해주세요.',
    )
    expect(getMe).not.toHaveBeenCalled()
  })

  test('선택한 역할과 계정 역할이 다르면 로그인 화면으로 돌려보낸다', async () => {
    sessionStorage.setItem('oauth_intended_role', 'MENTOR')
    vi.mocked(getMe).mockResolvedValue(
      createAxiosResponse({
        status: 200,
        code: 'SUCCESS',
        message: '내 정보를 조회했습니다.',
        data: {
          id: 1,
          email: 'student@example.com',
          name: '학생',
          nickname: 'student',
          role: 'STUDENT',
          profile_image_url: null,
          created_at: new Date().toISOString(),
        },
      }),
    )

    renderWithRouter(<OAuthCallbackPage />, {
      route: '/oauth/callback?access_token=social-access-token',
    })

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login?error=oauth_role_mismatch', {
        replace: true,
      })
    })

    expect(localStorage.getItem('access_token')).toBeNull()
    expect(sessionStorage.getItem('oauth_intended_role')).toBeNull()
  })
})
