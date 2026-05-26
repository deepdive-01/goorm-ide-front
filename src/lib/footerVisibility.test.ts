import { describe, expect, it } from 'vitest'
import { shouldShowFooter } from './footerVisibility'

describe('shouldShowFooter', () => {
  it('랜딩·스페이스 목록에는 Footer를 표시한다', () => {
    expect(shouldShowFooter('/')).toBe(true)
    expect(shouldShowFooter('/student/spaces')).toBe(true)
    expect(shouldShowFooter('/teacher/spaces')).toBe(true)
  })

  it('스페이스 하위(문항 목록·워크스페이스)에는 Footer를 숨긴다', () => {
    expect(shouldShowFooter('/student/spaces/1/problems')).toBe(false)
    expect(shouldShowFooter('/student/spaces/1/problems/2')).toBe(false)
  })
})
