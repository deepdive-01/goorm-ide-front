import {
  getAdditionalInfoErrorMessage,
  getEmailSendErrorMessage,
  getEmailVerifyErrorMessage,
  getLoginErrorMessage,
  getSignupErrorMessage,
} from '@/lib/auth'
import { createAxiosError } from '@/tests/authTestUtils'

describe('auth error messages', () => {
  test('로그인 API 에러 코드를 사용자 메시지로 변환한다', () => {
    expect(getLoginErrorMessage(createAxiosError(401, 'INVALID_CREDENTIALS'))).toBe(
      '이메일 또는 비밀번호가 올바르지 않습니다',
    )
    expect(getLoginErrorMessage(createAxiosError(404, 'ACCOUNT_NOT_FOUND'))).toBe(
      '존재하지 않는 계정입니다. 회원가입을 진행해주세요.',
    )
    expect(getLoginErrorMessage(createAxiosError(403, 'ROLE_MISMATCH'))).toBe(
      '선택한 사용자 유형이 올바르지 않습니다',
    )
  })

  test('회원가입 API 에러 코드를 사용자 메시지로 변환한다', () => {
    expect(getSignupErrorMessage(createAxiosError(409, 'EMAIL_ALREADY_EXISTS'))).toBe(
      '이미 사용 중인 이메일입니다',
    )
    expect(getSignupErrorMessage(createAxiosError(400, 'EMAIL_NOT_VERIFIED'))).toBe(
      '이메일 인증을 완료해주세요',
    )
    expect(getSignupErrorMessage(createAxiosError(400, 'UNKNOWN'))).toBe(
      '입력값을 확인해주세요',
    )
  })

  test('이메일 인증 API 에러 코드를 사용자 메시지로 변환한다', () => {
    expect(getEmailSendErrorMessage(createAxiosError(409, 'EMAIL_ALREADY_EXISTS'))).toBe(
      '이미 사용 중인 이메일입니다',
    )
    expect(getEmailVerifyErrorMessage(createAxiosError(400, 'INVALID_VERIFY_CODE'))).toBe(
      '인증코드가 올바르지 않습니다',
    )
    expect(getEmailVerifyErrorMessage(createAxiosError(410, 'VERIFY_CODE_EXPIRED'))).toBe(
      '인증코드가 만료되었습니다',
    )
  })

  test('소셜 추가정보 API 에러 코드를 사용자 메시지로 변환한다', () => {
    expect(
      getAdditionalInfoErrorMessage(createAxiosError(409, 'EMAIL_ALREADY_EXISTS')),
    ).toBe('이미 가입된 이메일입니다. 기존 계정으로 로그인해주세요.')
    expect(getAdditionalInfoErrorMessage(createAxiosError(400, 'INVALID_TEMP_KEY'))).toBe(
      '유효하지 않은 가입 요청입니다. 다시 소셜 로그인을 시도해 주세요.',
    )
  })
})
