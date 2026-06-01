import {
  mapSubmissionToTeacherListItem,
  normalizeSubmissionList,
} from '@/lib/submissionMapper'
import { getSubmissions } from '@/services/submission'
import type { ProblemListItem } from '@/types/problem.type'
import type { TeacherSpaceSubmissionListItem } from '@/types/teacherSpaceSubmission.type'

/** 스페이스 내 문제별 제출 목록에서 submission_id로 항목을 찾는다 */
export async function findTeacherSpaceSubmission(
  submissionId: number,
  problems: ProblemListItem[],
): Promise<TeacherSpaceSubmissionListItem | null> {
  if (!Number.isFinite(submissionId) || submissionId <= 0 || problems.length === 0) {
    return null
  }

  for (const problem of problems) {
    try {
      const { data } = await getSubmissions(problem.id)
      const list = normalizeSubmissionList(data.data)
      const match = list.submissions.find(
        (submission) => submission.submission_id === submissionId,
      )

      if (match) {
        return mapSubmissionToTeacherListItem(match, problem.id, problem.title)
      }
    } catch {
      continue
    }
  }

  return null
}
