import { useCallback, useEffect, useState } from 'react'
import { findTeacherSpaceSubmission } from '@/lib/findSpaceSubmission'
import { getSubmission } from '@/services/file'
import { getFeedbacks } from '@/services/feedback'
import { normalizeFeedbackList } from '@/lib/feedbackMapper'
import type { ProblemListItem } from '@/types/problem.type'

export type TeacherSubmissionReviewContext = {
  submissionId: number
  problemId: number
  studentId: number
  studentNickname: string
  submittedAt: string
  code: string
}

interface UseTeacherSubmissionReviewResult {
  review: TeacherSubmissionReviewContext | null
  isLoading: boolean
  error: string | null
  refetch: () => void
}

function readSubmissionCode(detail: {
  submitted_code: string | null
  saved_code: string | null
}) {
  return detail.submitted_code ?? detail.saved_code ?? ''
}

export function useTeacherSubmissionReview(
  submissionId: number,
  problems: ProblemListItem[],
  isProblemsLoading: boolean,
): UseTeacherSubmissionReviewResult {
  const [review, setReview] = useState<TeacherSubmissionReviewContext | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  const problemsKey = problems.map((problem) => problem.id).join(',')

  useEffect(() => {
    if (isProblemsLoading) {
      return
    }

    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      setError(null)
      setReview(null)

      if (!Number.isFinite(submissionId) || submissionId <= 0) {
        if (isMounted) {
          setError('제출 정보를 찾을 수 없습니다')
          setIsLoading(false)
        }
        return
      }

      if (problems.length === 0) {
        if (isMounted) {
          setError('제출 정보를 찾을 수 없습니다')
          setIsLoading(false)
        }
        return
      }

      try {
        const listItem = await findTeacherSpaceSubmission(submissionId, problems)

        if (!listItem) {
          if (isMounted) {
            setError('제출 정보를 찾을 수 없습니다')
          }
          return
        }

        const { data: submissionResponse } = await getSubmission(
          listItem.problemId,
          listItem.studentId,
        )
        const detail = submissionResponse.data
        const code = readSubmissionCode(detail)

        if (isMounted) {
          setReview({
            submissionId: listItem.id,
            problemId: listItem.problemId,
            studentId: listItem.studentId,
            studentNickname: listItem.studentNickname,
            submittedAt: listItem.submittedAt || detail.updated_at || detail.created_at,
            code,
          })
        }
      } catch {
        if (isMounted) {
          setError('제출 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [submissionId, problemsKey, isProblemsLoading, reloadKey]) // eslint-disable-line react-hooks/exhaustive-deps

  return { review, isLoading, error, refetch }
}

export function useSubmissionFeedbacks(submissionId: number) {
  const isEnabled = Number.isFinite(submissionId) && submissionId > 0

  const [feedbacks, setFeedbacks] = useState<ReturnType<typeof normalizeFeedbackList>>([])
  const [loadedSubmissionId, setLoadedSubmissionId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const isLoading = loadedSubmissionId !== submissionId

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let isMounted = true

    const load = async () => {
      setError(null)

      try {
        const { data } = await getFeedbacks(submissionId)
        if (isMounted) {
          setFeedbacks(normalizeFeedbackList(data.data))
          setLoadedSubmissionId(submissionId)
        }
      } catch {
        if (isMounted) {
          setFeedbacks([])
          setError('피드백을 불러오지 못했습니다.')
          setLoadedSubmissionId(submissionId)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [isEnabled, submissionId, reloadKey])

  if (!isEnabled) {
    return {
      feedbacks: [],
      isLoading: false,
      error: null,
      refetch,
    }
  }

  return { feedbacks, isLoading, error, refetch }
}
