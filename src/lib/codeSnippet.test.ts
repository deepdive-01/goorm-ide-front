import { extractCodeLine } from './codeSnippet'

const SAMPLE = `# 두 수를 입력받아 합을 출력하세요
a,b=map(int,input().split())
print(a+b)`

describe('extractCodeLine', () => {
  test('해당 줄만 추출한다', () => {
    expect(extractCodeLine(SAMPLE, 1)).toBe('# 두 수를 입력받아 합을 출력하세요')
    expect(extractCodeLine(SAMPLE, 2)).toBe('a,b=map(int,input().split())')
  })

  test('범위 밖이면 빈 문자열을 반환한다', () => {
    expect(extractCodeLine(SAMPLE, 0)).toBe('')
    expect(extractCodeLine(SAMPLE, 99)).toBe('')
  })
})
