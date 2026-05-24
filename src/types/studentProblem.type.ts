import type { ProblemListItem } from '@/types/problem.type'

export type ProblemSubmissionStatus = 'COMPLETED' | 'SUBMITTED' | 'NOT_SUBMITTED'

export type StudentProblemListItem = ProblemListItem & {
  /** MSW·목 UI — API 스펙 확정 시 교체 */
  submission_status?: ProblemSubmissionStatus
  testcase_count?: number
}
