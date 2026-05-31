export const CODE_FEEDBACK_COPY = {
  lineLabel: (startLine: number, endLine?: number) =>
    endLine !== undefined && endLine !== startLine
      ? `줄 ${startLine}-${endLine}`
      : `줄 ${startLine}`,
  commentIconLabel: (startLine: number, endLine?: number) =>
    `${CODE_FEEDBACK_COPY.lineLabel(startLine, endLine)} 피드백 보기`,
  emptyCodeComments: '코드 코멘트가 없습니다.',
  emptySubmissionFeedback: '아직 받은 피드백이 없습니다.',
} as const

export const MOCK_CODE_FEEDBACK_SAMPLE = `# 두 수를 입력받아 합을 출력하세요
a,b=map(int,input().split())
print(a+b)`

export const MOCK_CODE_LINE_COMMENTS = [
  {
    id: 'fb-1',
    lineNumber: 1,
    message: 'map 함수를 사용해 깔끔하게 처리했네요!',
    authorName: '김강사',
  },
] as const
