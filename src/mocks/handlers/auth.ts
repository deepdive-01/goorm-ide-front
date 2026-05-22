import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('*/api/v1/auth/signup', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '회원가입이 완료되었습니다',
      data: {
        id: 1,
        email: 'test@example.com',
        name: '테스트',
        nickname: '테스트',
        role: 'STUDENT',
        created_at: new Date().toISOString(),
      },
    }),
  ),

  http.post('*/api/v1/auth/login', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '로그인 성공',
      data: {
        access_token: 'mock-access-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    }),
  ),

  http.post('*/api/v1/auth/logout', () =>
    HttpResponse.json({
      status: 200,
      code: 'LOGOUT_SUCCESS',
      message: '로그아웃이 완료됐습니다.',
      data: null,
    }),
  ),

  http.post('*/api/v1/auth/refresh', () =>
    HttpResponse.json({
      status: 200,
      code: 'TOKEN_REISSUED',
      message: '토큰이 재발급됐습니다.',
      data: {
        access_token: 'mock-refreshed-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    }),
  ),

  http.post('*/api/v1/auth/email/send', () =>
    HttpResponse.json({
      status: 200,
      code: 'EMAIL_SEND_SUCCESS',
      message: '인증 코드가 발송됐습니다.',
      data: null,
    }),
  ),

  http.post('*/api/v1/auth/email/verify', () =>
    HttpResponse.json({
      status: 200,
      code: 'EMAIL_VERIFY_SUCCESS',
      message: '이메일 인증이 완료됐습니다.',
      data: null,
    }),
  ),

  http.post('*/api/v1/auth/oauth/signup', () =>
    HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '회원가입이 완료되었습니다.',
      data: {
        access_token: 'mock-oauth-token',
        token_type: 'Bearer',
        expires_in: 3600,
      },
    }),
  ),
]
