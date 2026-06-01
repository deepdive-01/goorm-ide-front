import { formatInviteCode } from './inviteCode'

describe('formatInviteCode', () => {
  test('6자리 숫자 코드를 그대로 표시한다', () => {
    expect(formatInviteCode('152436')).toBe('152436')
  })

  test('6자리 미만이면 앞을 0으로 채운다', () => {
    expect(formatInviteCode('12345')).toBe('012345')
  })

  test('6자리 초과 숫자는 앞 6자리만 사용한다', () => {
    expect(formatInviteCode('1234567890')).toBe('123456')
  })

  test('문자가 포함된 코드는 숫자만 추출해 6자리로 맞춘다', () => {
    expect(formatInviteCode('ABC12345')).toBe('012345')
  })
})
