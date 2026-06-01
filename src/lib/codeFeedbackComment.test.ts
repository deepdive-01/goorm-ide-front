import { describe, expect, it } from 'vitest'
import { getCommentLabelLineRange } from './codeFeedbackComment'

describe('getCommentLabelLineRange', () => {
  it('단일 줄이면 end를 반환하지 않는다', () => {
    expect(
      getCommentLabelLineRange({ lineNumber: 2, endLineNumber: 2 }),
    ).toEqual({ start: 2, end: 2 })
  })

  it('여러 줄이면 end를 계산한다', () => {
    expect(
      getCommentLabelLineRange({ lineNumber: 1, endLineNumber: 3 }),
    ).toEqual({ start: 1, end: 3 })
  })

  it('스니펫 오프셋이 있으면 라벨 줄 번호에 맞춘다', () => {
    expect(
      getCommentLabelLineRange({
        lineNumber: 1,
        endLineNumber: 3,
        labelLineNumber: 10,
      }),
    ).toEqual({ start: 10, end: 12 })
  })
})
