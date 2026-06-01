/** code 문자열에서 N번째 줄(1부터)만 반환합니다. 없으면 빈 문자열. */
export function extractCodeLine(code: string, lineNumber: number): string {
  const lines = code.split('\n')
  const index = lineNumber - 1

  if (index < 0 || index >= lines.length) return ''

  return lines[index]
}
