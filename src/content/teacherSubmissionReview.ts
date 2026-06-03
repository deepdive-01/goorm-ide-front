/** 문제 설명 카드와 동일한 스크롤 높이 */
export const TEACHER_REVIEW_PROBLEM_SCROLL_MAX_CLASS =
  'max-h-[min(420px,50vh)]'

/** 학생 코드·줄 코멘트 입력 영역 스크롤 높이 */
export const TEACHER_REVIEW_STUDENT_CODE_SCROLL_MAX_CLASS =
  'max-h-[min(560px,60vh)]'

export const TEACHER_SUBMISSION_REVIEW_COPY = {
  backToSpace: (spaceName: string) => spaceName,
  submissionTitle: (nickname: string) => `${nickname}의 제출`,
  save: '저장',
  invalidParams: '유효한 제출 정보를 찾을 수 없습니다.',
  studentCode: '학생 코드',
  submittedAt: (formatted: string) => `제출 시간: ${formatted}`,
  lineClickHint:
    '줄 번호를 클릭하여 코멘트 추가(Shift+클릭으로 범위 선택)',
  addCommentToLine: (startLine: number, endLine: number) =>
    startLine === endLine
      ? `줄 ${startLine}에 코멘트 추가`
      : `줄 ${startLine}-${endLine}에 코멘트 추가`,
  commentPlaceholder: '코멘트를 입력하세요.',
  addComment: '추가',
  codeCommentsTitle: '코드 코멘트',
  codeCommentsDescription: '특정 코드 줄에 대한 코멘트입니다.',
  pastFeedbackTitle: '과거 피드백',
  pastFeedbackDescription: '이전 제출 회차에 남긴 전체 피드백입니다.',
  overallFeedbackTitle: '전체 피드백',
  overallFeedbackDescription: '이번 제출에 대한 전체 피드백을 작성하세요.',
  overallFeedbackPlaceholder: '학생에게 전달할 전체 피드백을 작성하세요.',
  removeComment: '코멘트 삭제',
  lineRangeLabel: (startLine: number, endLine: number) =>
    startLine === endLine ? `줄 ${startLine}` : `줄 ${startLine}-${endLine}`,
  emptyCodeComments: '코드 코멘트가 없습니다.',
  cancelLineComment: '취소',
  lineCommentRequired: '댓글 내용을 입력해주세요',
  overallFeedbackRequired: '전체 피드백을 입력해주세요',
  overallFeedbackMaxLength: '피드백 길이를 초과했습니다',
  saveCommentError: '댓글 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  deleteCommentError: '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.',
  saveReviewError: '리뷰 저장에 실패했습니다. 잠시 후 다시 시도해주세요.',
  loadReviewError: '제출 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
} as const

/** 전체 피드백 최대 길이 (Swagger 기준) */
export const TEACHER_OVERALL_FEEDBACK_MAX_LENGTH = 2000

export const MOCK_TEACHER_SUBMITTED_CODE = `# 두 수를 입력받아 합을 출력하세요
a,b=map(int,input().split())
print(a+b)`
