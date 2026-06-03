import { http, HttpResponse } from 'msw'
import type {
  EmailSendRequest,
  EmailVerifyRequest,
  LoginRequest,
  OAuthSignupRequest,
  SignupRequest,
} from '@/types/auth.type'
import {
  findMockAccountByEmail,
  isMockEmailTaken,
  issueMockAccessToken,
  registerMockAccount,
} from '../fixtures'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

export const authHandlers = [
  http.post('*/api/v1/auth/signup', async ({ request }) => {
    const body = (await request.json()) as SignupRequest
    const normalizedEmail = normalizeEmail(body.email)

    if (isMockEmailTaken(normalizedEmail) || normalizedEmail === 'duplicate@example.com') {
      return HttpResponse.json(
        {
          status: 409,
          code: 'AUTH_EMAIL_ALREADY_EXISTS',
          message: '이미 사용 중인 이메일입니다.',
          data: null,
        },
        { status: 409 },
      )
    }

    const createdUser = registerMockAccount({
      email: normalizedEmail,
      password: body.password,
      name: body.name,
      nickname: body.nickname,
      role: body.role,
    })

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '회원가입이 완료되었습니다',
      data: createdUser,
    })
  }),

  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json()) as LoginRequest
    const normalizedEmail = normalizeEmail(body.email)
    const account = findMockAccountByEmail(normalizedEmail)

    if (normalizedEmail === 'server-error@example.com') {
      return HttpResponse.json(
        {
          status: 500,
          code: 'INTERNAL_SERVER_ERROR',
          message: '서버 오류가 발생했습니다.',
          data: null,
        },
        { status: 500 },
      )
    }

    if (!account && normalizedEmail !== 'wrong-role@example.com') {
      return HttpResponse.json(
        {
          status: 404,
          code: 'AUTH_ACCOUNT_NOT_FOUND',
          message: '존재하지 않는 계정입니다.',
          data: null,
        },
        { status: 404 },
      )
    }

    if (
      normalizedEmail === 'wrong-role@example.com' ||
      (account && account.user.role !== body.role)
    ) {
      return HttpResponse.json(
        {
          status: 403,
          code: 'AUTH_ROLE_MISMATCH',
          message: '선택한 사용자 유형이 올바르지 않습니다.',
          data: null,
        },
        { status: 403 },
      )
    }

    if (account?.password !== body.password) {
      return HttpResponse.json(
        {
          status: 401,
          code: 'AUTH_INVALID_CREDENTIALS',
          message: '이메일 또는 비밀번호가 올바르지 않습니다.',
          data: null,
        },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '로그인 성공',
      data: {
        access_token: issueMockAccessToken(account.user),
        token_type: 'Bearer',
        expires_in: 3600,
      },
    })
  }),

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

  http.post('*/api/v1/auth/email/send', async ({ request }) => {
    const body = (await request.json()) as EmailSendRequest
    const normalizedEmail = normalizeEmail(body.email)

    if (isMockEmailTaken(normalizedEmail) || normalizedEmail === 'duplicate@example.com') {
      return HttpResponse.json(
        {
          status: 409,
          code: 'AUTH_EMAIL_ALREADY_EXISTS',
          message: '이미 사용 중인 이메일입니다.',
          data: null,
        },
        { status: 409 },
      )
    }

    return HttpResponse.json({
      status: 200,
      code: 'EMAIL_SEND_SUCCESS',
      message: '인증 코드가 발송됐습니다.',
      data: null,
    })
  }),

  http.post('*/api/v1/auth/email/verify', async ({ request }) => {
    const body = (await request.json()) as EmailVerifyRequest

    if (body.code === '000000') {
      return HttpResponse.json(
        {
          status: 410,
          code: 'AUTH_EMAIL_CODE_EXPIRED',
          message: '인증코드가 만료되었습니다.',
          data: null,
        },
        { status: 410 },
      )
    }

    if (body.code !== '123456') {
      return HttpResponse.json(
        {
          status: 400,
          code: 'AUTH_EMAIL_CODE_MISMATCH',
          message: '인증코드가 올바르지 않습니다.',
          data: null,
        },
        { status: 400 },
      )
    }

    return HttpResponse.json({
      status: 200,
      code: 'EMAIL_VERIFY_SUCCESS',
      message: '이메일 인증이 완료됐습니다.',
      data: null,
    })
  }),

  http.post('*/api/v1/auth/oauth/signup', async ({ request }) => {
    const body = (await request.json()) as OAuthSignupRequest
    const normalizedEmail = normalizeEmail(body.email)

    if (!body.temp_key.startsWith('mock-') && body.temp_key !== 'valid-temp-key') {
      return HttpResponse.json(
        {
          status: 400,
          code: 'AUTH_INVALID_TEMP_KEY',
          message: '유효하지 않은 가입 요청입니다.',
          data: null,
        },
        { status: 400 },
      )
    }

    if (isMockEmailTaken(normalizedEmail) || normalizedEmail === 'duplicate@example.com') {
      return HttpResponse.json(
        {
          status: 409,
          code: 'AUTH_EMAIL_ALREADY_EXISTS',
          message: '이미 가입된 이메일입니다.',
          data: null,
        },
        { status: 409 },
      )
    }

    const createdUser = registerMockAccount({
      email: normalizedEmail,
      password: `oauth-${body.temp_key}`,
      name: body.name,
      nickname: body.nickname,
      role: body.role,
    })

    return HttpResponse.json({
      status: 200,
      code: 'SUCCESS',
      message: '회원가입이 완료되었습니다.',
      data: {
        access_token: issueMockAccessToken(createdUser, 'mock-oauth-token'),
        token_type: 'Bearer',
        expires_in: 3600,
      },
    })
  }),
]
