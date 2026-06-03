import { useEffect, useState } from 'react'
import {
  attachSubmissionFeedbackCounts,
  mapSubmissionToTeacherListItem,
} from '@/lib/submissionMapper'
import { getSubmissions } from '@/services/submission'
import type { ProblemListItem } from '@/types/problem.type'
import type { TeacherSpaceSubmissionListItem } from '@/types/teacherSpaceSubmission.type'

interface UseSpaceSubmissionsResult {
  submissions: TeacherSpaceSubmissionListItem[]
  isLoading: boolean
  error: string | null
}

export function useSpaceSubmissions(
  spaceId: number,
  problems: ProblemListItem[],
  isProblemsLoading: boolean,
): UseSpaceSubmissionsResult {
  const isValidSpaceId = Number.isFinite(spaceId) && spaceId > 0
  const [submissions, setSubmissions] = useState<TeacherSpaceSubmissionListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const problemsKey = problems.map((problem) => problem.id).join(',')

  useEffect(() => {
    if (!isValidSpaceId || isProblemsLoading) {
      return
    }

    let isMounted = true

    const fetchSubmissions = async () => {
      setIsLoading(true)
      setError(null)

      if (problems.length === 0) {
        if (isMounted) {
          setSubmissions([])
          setIsLoading(false)
        }
        return
      }

      try {
        const results = await Promise.all(
          problems.map(async (problem) => {
            const { data } = await getSubmissions(problem.id)
            return data.data.submissions.map((submission) =>
              mapSubmissionToTeacherListItem(submission, problem.id, problem.title),
            )
          }),
        )

        const aggregated = results
          .flat()
          .sort((a, b) => {
            if (a.feedbackStatus !== b.feedbackStatus) {
              return a.feedbackStatus === 'PENDING' ? -1 : 1
            }

            return a.studentNickname.localeCompare(b.studentNickname, 'ko')
          })

        const withFeedbackCounts = await attachSubmissionFeedbackCounts(aggregated)

        const sorted = withFeedbackCounts.sort((a, b) => {
          if (a.feedbackStatus !== b.feedbackStatus) {
            return a.feedbackStatus === 'PENDING' ? -1 : 1
          }

          return a.studentNickname.localeCompare(b.studentNickname, 'ko')
        })

        if (isMounted) {
          setSubmissions(sorted)
        }
      } catch {
        if (isMounted) {
          setSubmissions([])
          setError('제출 현황을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSubmissions()

    return () => {
      isMounted = false
    }
  }, [isValidSpaceId, spaceId, problemsKey, isProblemsLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isValidSpaceId) {
    return { submissions: [], isLoading: false, error: null }
  }

  return { submissions, isLoading, error }
}
