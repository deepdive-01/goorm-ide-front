import type { ProblemListItem } from '@/types/problem.type'

export type ProblemSubmissionStatus = 'COMPLETED' | 'SUBMITTED' | 'NOT_SUBMITTED'

export type StudentProblemListItem = ProblemListItem & {
  /** MSW·목 UI — Swagger ProblemResponse에 없음. 실 API 연동 시 별도 조회·병합 */
  submission_status?: ProblemSubmissionStatus
  testcase_count?: number
}
