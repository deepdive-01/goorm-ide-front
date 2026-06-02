import { describe, expect, it } from 'vitest'
import { getCodeFeedbackSnippetHeight } from '@/lib/codeFeedbackEditorLayout'

describe('getCodeFeedbackSnippetHeight', () => {
  it('줄 수에 비례해 높이를 계산한다', () => {
    expect(getCodeFeedbackSnippetHeight(1)).toBe('45px')
    expect(getCodeFeedbackSnippetHeight(3)).toBe('95px')
    expect(getCodeFeedbackSnippetHeight(0)).toBe('45px')
  })
})
