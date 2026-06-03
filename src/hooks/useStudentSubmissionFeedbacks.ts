import { useCallback, useEffect, useState } from 'react'
import { mapFeedbacksToStudentViews, normalizeFeedbackList, filterFeedbacksForSubmission } from '@/lib/feedbackMapper'
import { getSubmission } from '@/services/file'
import { getFeedbacks } from '@/services/feedback'
import type {
  StudentCodeCommentItem,
  StudentSubmissionFeedbackItem,
} from '@/types/codeFeedback.type'

interface UseStudentSubmissionFeedbacksResult {
  submissionFeedback: StudentSubmissionFeedbackItem[]
  codeComments: StudentCodeCommentItem[]
  reviewCode: string
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

export function useStudentSubmissionFeedbacks(
  problemId: number,
  studentId: number,
): UseStudentSubmissionFeedbacksResult {
  const isEnabled =
    Number.isFinite(problemId) &&
    problemId > 0 &&
    Number.isFinite(studentId) &&
    studentId > 0

  const [submissionFeedback, setSubmissionFeedback] = useState<
    StudentSubmissionFeedbackItem[]
  >([])
  const [codeComments, setCodeComments] = useState<StudentCodeCommentItem[]>([])
  const [reviewCode, setReviewCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const refetch = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    if (!isEnabled) {
      return
    }

    let isMounted = true

    const load = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { data: submissionResponse } = await getSubmission(problemId, studentId)
        const detail = submissionResponse.data
        const submissionId = detail.id

        if (isMounted) {
          setReviewCode(readSubmissionCode(detail))
        }

        const { data: feedbackResponse } = await getFeedbacks(submissionId)
        const submittedAt = detail.submitted_code ? detail.updated_at : ''
        const feedbacks = filterFeedbacksForSubmission(
          normalizeFeedbackList(feedbackResponse.data),
          submittedAt,
        )
        const views = mapFeedbacksToStudentViews(feedbacks)

        if (isMounted) {
          setSubmissionFeedback(views.submissionFeedback)
          setCodeComments(views.codeComments)
        }
      } catch {
        if (isMounted) {
          setSubmissionFeedback([])
          setCodeComments([])
          setReviewCode('')
          setError('피드백을 불러오지 못했습니다.')
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
  }, [isEnabled, problemId, studentId, reloadKey])

  if (!isEnabled) {
    return {
      submissionFeedback: [],
      codeComments: [],
      reviewCode: '',
      isLoading: false,
      error: null,
      refetch,
    }
  }

  return {
    submissionFeedback,
    codeComments,
    reviewCode,
    isLoading,
    error,
    refetch,
  }
}
