import { describe, expect, it } from 'vitest'
import { formatApiDateTime } from '@/lib/formatDateTime'

describe('formatApiDateTime', () => {
  it('UTC(Z) 시각을 KST로 표시한다', () => {
    expect(formatApiDateTime('2026-05-14T09:00:00Z')).toBe('2026-05-14 18:00')
  })

  it('오프셋 없는 ISO 문자열을 UTC로 해석해 KST로 표시한다', () => {
    expect(formatApiDateTime('2026-05-14T09:00:00')).toBe('2026-05-14 18:00')
  })
})
