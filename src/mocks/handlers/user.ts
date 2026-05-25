import { http, HttpResponse } from 'msw'
import { getMockUserFromAccessToken } from '../fixtures'

export const userHandlers = [
  http.get('*/api/v1/users/me', ({ request }) => {
    const authorizationHeader = request.headers.get('Authorization')
    const accessToken = authorizationHeader?.replace(/^Bearer\s+/i, '') ?? null

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '내 정보를 조회했습니다.',
      data: getMockUserFromAccessToken(accessToken),
    })
  }),

  http.delete(
    '*/api/v1/users/me',
    () => new HttpResponse(null, { status: 204 }),
  ),
]
