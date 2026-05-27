import type {
  ProblemCodeCommentItem,
  ProblemFeedbackItem,
  SubmittedCodeReviewComment,
} from '@/types/studentProblemWorkspace.type'

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
  },
  review: {
    title: '제출 코드 리뷰',
    commentCount: (count: number) => `${count}개의 코멘트`,
    lineLabel: (line: number) => `줄 ${line}`,
  },
  invalidParams: '문항을 찾을 수 없습니다.',
} as const

/** MSW·UI 목 데이터 — API 연동 시 교체 */
const MOCK_TODAY = '2026.05.26'

export const MOCK_PROBLEM_WORKSPACE_FEEDBACK: ProblemFeedbackItem[] = [
  {
    id: 'fb-1',
    authorName: '김강사',
    createdAt: `${MOCK_TODAY} 14:45`,
    message:
      '전체 흐름이 좋습니다. 입력 → 연산 → 출력 순서가 문제 요구사항과 잘 맞아요.',
  },
  {
    id: 'fb-2',
    authorName: '김강사',
    createdAt: `${MOCK_TODAY} 15:05`,
    message:
      '입력 처리 부분이 특히 깔끔합니다. 한 줄로 받아서 바로 연산하는 방식이 읽기 쉬워요.',
    codeSnippet: 'a, b = map(int, input().split())',
  },
]

export const MOCK_PROBLEM_WORKSPACE_CODE_COMMENTS: ProblemCodeCommentItem[] = [
  {
    id: 'cc-1',
    authorName: '김강사',
    lineNumber: 4,
    createdAt: `${MOCK_TODAY} 15:08`,
    message:
      '출력까지 잘 연결하셨네요. `print(a + b)`로 결과를 바로 보여주는 방식이 명확합니다.',
  },
]

export const MOCK_SUBMITTED_CODE_REVIEW: SubmittedCodeReviewComment[] = [
  {
    lineNumber: 1,
    code: 'a, b = map(int, input().split())',
    authorName: '김강사',
    message:
      'map 함수를 사용해 깔끔하게 처리했네요! 한 줄로 입력을 처리하는 방식이 아주 효율적입니다.',
  },
]

export const DEFAULT_STUDENT_WORKSPACE_CODE = `# 두 수를 입력받아 합을 출력하세요
a, b = map(int, input().split())
# 여기에 코드를 작성하세요
print(a + b)`
