import type { CodeLineComment } from '@/types/codeFeedback.type'

/** 에디터 줄 번호·라벨 오프셋으로 팝오버에 표시할 줄 범위를 계산한다 */
export function getCommentLabelLineRange(
  comment: Pick<CodeLineComment, 'lineNumber' | 'endLineNumber' | 'labelLineNumber'>,
) {
  const start = comment.labelLineNumber ?? comment.lineNumber
  const end =
    comment.endLineNumber !== undefined
      ? start + (comment.endLineNumber - comment.lineNumber)
      : undefined

  return { start, end }
}
