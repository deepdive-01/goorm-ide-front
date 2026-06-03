/** code 문자열에서 N번째 줄(1부터)만 반환합니다. 없으면 빈 문자열. */
export function extractCodeLine(code: string, lineNumber: number): string {
  return extractCodeLines(code, lineNumber, lineNumber)
}

/** code 문자열에서 startLine~endLine 범위(1부터)를 반환합니다. */
export function extractCodeLines(
  code: string,
  startLine: number,
  endLine: number = startLine,
): string {
  const lines = code.split('\n')
  const startIndex = startLine - 1
  const endIndex = endLine - 1

  if (startIndex < 0 || startIndex >= lines.length) {
    return ''
  }

  const safeEndIndex = Math.min(Math.max(endIndex, startIndex), lines.length - 1)

  return lines.slice(startIndex, safeEndIndex + 1).join('\n')
}
