import { useCallback, useMemo, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Card from '@/components/common/Card/Card'
import Spinner from '@/components/common/Spinner/Spinner'
import ProblemDetailView from '@/components/problem/ProblemDetailView'
import TeacherCodeCommentsPanel from '@/components/teacher/submissionReview/TeacherCodeCommentsPanel'
import TeacherOverallFeedbackPanel from '@/components/teacher/submissionReview/TeacherOverallFeedbackPanel'
import TeacherStudentCodeSection from '@/components/teacher/submissionReview/TeacherStudentCodeSection'
import TeacherSubmissionReviewSubHeader from '@/components/teacher/submissionReview/TeacherSubmissionReviewSubHeader'
import {
  TEACHER_OVERALL_FEEDBACK_MAX_LENGTH,
  TEACHER_REVIEW_PROBLEM_SCROLL_MAX_CLASS,
  TEACHER_SUBMISSION_REVIEW_COPY,
} from '@/content/teacherSubmissionReview'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblem } from '@/hooks/useProblem'
import {
  useSubmissionFeedbacks,
  useTeacherSubmissionReview,
} from '@/hooks/useTeacherSubmissionReview'
import { useProblems } from '@/hooks/useProblems'
import { useWorkspace } from '@/hooks/useWorkspace'
import { getRoleSpacesPath } from '@/lib/authRoutes'
import {
  findOverallFeedbackComment,
  mapHighlightsToTeacherLineComments,
} from '@/lib/feedbackMapper'
import { toEditorLanguage } from '@/lib/problemLanguage'
import { buildTeacherLineSelection, type TeacherLineSelection } from '@/lib/teacherLineComment'
import {
  createComment,
  createHighlight,
  deleteFeedback,
  updateFeedback,
} from '@/services/feedback'
function SubmissionReviewPage() {
  const { spaceId: spaceIdParam, submissionId: submissionIdParam } = useParams()
  const spaceId = Number(spaceIdParam)
  const submissionId = Number(submissionIdParam)

  if (
    !Number.isFinite(spaceId) ||
    spaceId <= 0 ||
    !Number.isFinite(submissionId) ||
    submissionId <= 0
  ) {
    return <Navigate to="/teacher/spaces" replace />
  }

  return (
    <SubmissionReviewContent
      key={submissionId}
      spaceId={spaceId}
      submissionId={submissionId}
    />
  )
}

function SubmissionReviewContent({
  spaceId,
  submissionId,
}: {
  spaceId: number
  submissionId: number
}) {
  const navigate = useNavigate()
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)
  const { problems, isLoading: isProblemsLoading } = useProblems(spaceId)
  const {
    review,
    isLoading: isReviewLoading,
    error: reviewError,
    refetch: refetchReview,
  } = useTeacherSubmissionReview(submissionId, problems, isProblemsLoading)
  const {
    feedbacks,
    isLoading: isFeedbacksLoading,
    refetch: refetchFeedbacks,
  } = useSubmissionFeedbacks(submissionId)

  const problemId = review?.problemId ?? 0
  const { problem, isLoading: isProblemLoading } = useProblem(spaceId, problemId)

  const lineComments = useMemo(
    () => mapHighlightsToTeacherLineComments(feedbacks),
    [feedbacks],
  )

  const overallFromFeedbacks = useMemo(() => {
    const overall = findOverallFeedbackComment(feedbacks)
    return {
      content: overall?.content ?? '',
      id: overall?.feedback_id ?? null,
    }
  }, [feedbacks])

  const [overallDraft, setOverallDraft] = useState<{
    content: string
    id: number | null
  } | null>(null)

  const overallFeedback =
    overallDraft?.content ??
    (isFeedbacksLoading ? '' : overallFromFeedbacks.content)
  const overallFeedbackId = overallDraft?.id ?? overallFromFeedbacks.id

  const handleOverallFeedbackChange = useCallback(
    (content: string) => {
      setOverallDraft((previous) => ({
        content,
        id: previous?.id ?? overallFromFeedbacks.id,
      }))
    },
    [overallFromFeedbacks.id],
  )

  const [lineSelection, setLineSelection] = useState<TeacherLineSelection | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  const editorLanguage = useMemo(
    () => (problem ? toEditorLanguage(problem.language) : 'PYTHON'),
    [problem],
  )

  const isLoading =
    isUserLoading ||
    isWorkspaceLoading ||
    isProblemsLoading ||
    isReviewLoading ||
    isProblemLoading ||
    isFeedbacksLoading

  const handleLineNumberClick = useCallback((lineNumber: number, shiftKey: boolean) => {
    setLineSelection((previous) => buildTeacherLineSelection(previous, lineNumber, shiftKey))
  }, [])

  const handleAddLineComment = useCallback(
    async (startLine: number, endLine: number, message: string) => {
      const trimmed = message.trim()
      if (!trimmed) {
        setActionError(TEACHER_SUBMISSION_REVIEW_COPY.lineCommentRequired)
        return
      }

      if (!review) return

      setActionError(null)

      try {
        await createHighlight({
          submission_id: review.submissionId,
          start_line: startLine,
          end_line: endLine,
          color: 'YELLOW',
          content: trimmed,
        })
        setLineSelection(null)
        refetchFeedbacks()
      } catch {
        setActionError(TEACHER_SUBMISSION_REVIEW_COPY.saveCommentError)
      }
    },
    [review, refetchFeedbacks],
  )

  const handleRemoveLineComment = useCallback(
    async (id: string) => {
      const feedbackId = Number(id)
      if (!Number.isFinite(feedbackId) || feedbackId <= 0) {
        return
      }

      setActionError(null)

      try {
        await deleteFeedback(feedbackId)
        refetchFeedbacks()
      } catch {
        setActionError(TEACHER_SUBMISSION_REVIEW_COPY.deleteCommentError)
      }
    },
    [refetchFeedbacks],
  )

  const handleSave = useCallback(async () => {
    if (!review) return

    const trimmed = overallFeedback.trim()
    if (trimmed.length > TEACHER_OVERALL_FEEDBACK_MAX_LENGTH) {
      setActionError(TEACHER_SUBMISSION_REVIEW_COPY.overallFeedbackMaxLength)
      return
    }

    setIsSaving(true)
    setActionError(null)

    try {
      if (trimmed) {
        if (overallFeedbackId) {
          await updateFeedback(overallFeedbackId, { content: trimmed })
        } else {
          await createComment({
            submission_id: review.submissionId,
            content: trimmed,
          })
        }
      }

      navigate(`/teacher/spaces/${spaceId}`)
    } catch {
      setActionError(TEACHER_SUBMISSION_REVIEW_COPY.saveReviewError)
    } finally {
      setIsSaving(false)
    }
  }, [navigate, overallFeedback, overallFeedbackId, review, spaceId])

  if (isUserLoading) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'MENTOR') {
    return <Navigate to={getRoleSpacesPath(user)} replace />
  }

  if (!isLoading && (reviewError || !review)) {
    return (
      <main className="bg-background text-light-background flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <p className="text-body1 text-gray-400">
          {reviewError ?? TEACHER_SUBMISSION_REVIEW_COPY.invalidParams}
        </p>
        <button
          type="button"
          className="text-body2 text-neon-green hover:underline"
          onClick={() => {
            refetchReview()
            refetchFeedbacks()
          }}
        >
          다시 시도
        </button>
      </main>
    )
  }

  if (!isLoading && (!workspace || !problem || !review)) {
    return (
      <main className="bg-background text-light-background flex flex-1 items-center justify-center px-4">
        <p className="text-body1 text-gray-400">
          {TEACHER_SUBMISSION_REVIEW_COPY.invalidParams}
        </p>
      </main>
    )
  }

  if (isLoading || !workspace || !problem || !review) {
    return (
      <main className="bg-background flex flex-1 items-center justify-center">
        <Spinner size="md" color="text-neon-green" />
      </main>
    )
  }

  return (
    <div className="bg-background text-light-background flex flex-1 flex-col">
      <TeacherSubmissionReviewSubHeader
        spaceName={workspace.name}
        studentNickname={review.studentNickname}
        onBack={() => navigate(`/teacher/spaces/${spaceId}`)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      {actionError && (
        <p className="text-body2 text-red-400 mx-auto w-full max-w-[1512px] px-4 sm:px-16 lg:px-22">
          {actionError}
        </p>
      )}

      <main className="mx-auto flex min-h-0 w-full max-w-[1512px] flex-1 flex-col gap-6 px-4 py-6 sm:px-16 lg:px-22 lg:py-8">
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
          <section className="flex min-w-0 flex-col gap-6">
            <Card
              width="w-full"
              className={`scrollbar-theme bg-[#0d0d0d] border-gray-800 overflow-y-auto px-6 py-8 sm:px-10 ${TEACHER_REVIEW_PROBLEM_SCROLL_MAX_CLASS}`}
            >
              <ProblemDetailView problem={problem} />
            </Card>

            <TeacherStudentCodeSection
              code={review.code}
              language={editorLanguage}
              submittedAt={review.submittedAt}
              lineComments={lineComments}
              lineSelection={lineSelection}
              onLineNumberClick={handleLineNumberClick}
              onAddLineComment={handleAddLineComment}
              onDismissLineCommentForm={() => setLineSelection(null)}
            />
          </section>

          <section className="flex min-w-0 flex-col gap-6">
            <TeacherCodeCommentsPanel
              comments={lineComments}
              onRemove={handleRemoveLineComment}
            />
            <TeacherOverallFeedbackPanel
              value={overallFeedback}
              onChange={handleOverallFeedbackChange}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default SubmissionReviewPage
