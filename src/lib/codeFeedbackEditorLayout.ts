/** CodeFeedbackEditor Monaco options(lineHeight=25, padding top/bottom 10)와 동일 */
const LINE_HEIGHT_PX = 25
const VERTICAL_PADDING_PX = 20

/** 스니펫 줄 수에 맞는 읽기 전용 에디터 높이(px 문자열) */
export function getCodeFeedbackSnippetHeight(lineCount: number): string {
  const lines = Math.max(1, lineCount)
  return `${lines * LINE_HEIGHT_PX + VERTICAL_PADDING_PX}px`
}
