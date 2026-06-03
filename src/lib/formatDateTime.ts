const KST_TIME_ZONE = 'Asia/Seoul'

/** 타임존 오프셋이 없으면 UTC로 간주한다 (Swagger ISO 문자열) */
export function parseApiDateTime(value: string): Date {
  const trimmed = value.trim()
  if (!trimmed) {
    return new Date(Number.NaN)
  }

  if (/[zZ]$/.test(trimmed) || /[+-]\d{2}:\d{2}$/.test(trimmed)) {
    return new Date(trimmed)
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) {
    return new Date(`${trimmed}Z`)
  }

  return new Date(trimmed)
}

/** API 시각을 KST `YYYY-MM-DD HH:mm`으로 표시한다 */
export function formatApiDateTime(value: string): string {
  const date = parseApiDateTime(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: KST_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(date)

  const pick = (type: Intl.DateTimeFormatPart['type']) =>
    parts.find((part) => part.type === type)?.value ?? ''

  return `${pick('year')}-${pick('month')}-${pick('day')} ${pick('hour')}:${pick('minute')}`
}
