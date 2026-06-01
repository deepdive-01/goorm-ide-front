import type {
  StudentCodeCommentItem,
  StudentSubmissionFeedbackItem,
} from '@/types/codeFeedback.type'

export const STUDENT_PROBLEM_WORKSPACE_COPY = {
  backToProblems: '문항 목록',
  tabs: {
    description: '문제 설명',
    feedback: '피드백',
    codeComments: '코드 코멘트',
  },
  description: {
    title: '문제 설명',
    inputFormat: '입력 형식',
    outputFormat: '출력 형식',
    example: '예제',
    inputLabel: '입력',
    outputLabel: '출력',
    inputConstraint: '첫째 줄에 정수 a, b가 주어진다. (-1000 ≤ a, b ≤ 1000)',
    outputConstraint: 'a와 b의 합을 출력한다.',
  },
  editor: {
    title: '코드 에디터',
    run: '실행',
    submit: '제출',
    cancelSubmit: '제출 취소',
  },
  invalidParams: '문항을 찾을 수 없습니다.',
} as const

/** MSW·UI 목 데이터 — API 연동 시 교체 */
export const MOCK_PROBLEM_WORKSPACE_FEEDBACK: StudentSubmissionFeedbackItem[] = [
  {
    id: 'fb-1',
    authorName: '김강사',
    createdAt: '2026-05-14 18:00',
    message: '잘 작성했습니다! 전체적으로 간결한 코드입니다.',
  },
  {
    id: 'fb-2',
    authorName: '김강사',
    createdAt: '2026-05-14 19:30',
    message:
      '다음에는 예외 입력(빈 줄, 문자 등)도 한번 고려해 보세요. 전체 구조는 이미 좋습니다.',
  },
]

export const MOCK_PROBLEM_WORKSPACE_CODE_COMMENTS: StudentCodeCommentItem[] = [
  {
    id: 'cc-1',
    authorName: '김강사',
    lineNumber: 1,
    message: 'map 함수를 사용해 깔끔하게 처리했네요!',
  },
  {
    id: 'cc-2',
    authorName: '김강사',
    lineNumber: 2,
    message: '입력을 한 줄로 파싱하는 방식이 읽기 쉽습니다.',
  },
]

export const DEFAULT_STUDENT_WORKSPACE_CODE = `# 두 수를 입력받아 합을 출력하세요
a, b = map(int, input().split())
# 여기에 코드를 작성하세요
print(a + b)`
