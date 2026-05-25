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
      route: '/oauth/callback?accessToken=social-access-token',
    })

    await waitFor(() => {
      expect(getMe).toHaveBeenCalled()
    })

    expect(localStorage.getItem('access_token')).toBe('social-access-token')
    expect(mockedNavigate).toHaveBeenCalledWith('/teacher', { replace: true })
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
})
