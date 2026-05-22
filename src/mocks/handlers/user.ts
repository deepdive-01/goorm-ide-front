import { http, HttpResponse } from 'msw'
import { mockUser } from '../fixtures'

export const userHandlers = [
  http.get('*/api/v1/users/me', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '내 정보를 조회했습니다.',
      data: mockUser,
    }),
  ),

  http.delete(
    '*/api/v1/users/me',
    () => new HttpResponse(null, { status: 204 }),
  ),
]
