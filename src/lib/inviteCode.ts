/** API 초대 코드를 화면용 6자리 숫자로 표시합니다. */
export function formatInviteCode(code: string | undefined): string {
  if (!code) return '------'

  const digits = code.replace(/\D/g, '')
  if (digits.length === 0) return '------'
  if (digits.length >= 6) return digits.slice(0, 6)

  return digits.padStart(6, '0')
}
