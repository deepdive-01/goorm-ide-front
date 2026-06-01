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
  TEACHER_REVIEW_PROBLEM_SCROLL_MAX_CLASS,
  TEACHER_SUBMISSION_REVIEW_COPY,
} from '@/content/teacherSubmissionReview'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useProblem } from '@/hooks/useProblem'
import { useWorkspace } from '@/hooks/useWorkspace'
import { getRoleSpacesPath } from '@/lib/authRoutes'
import { buildTeacherLineSelection, type TeacherLineSelection } from '@/lib/teacherLineComment'
import { toEditorLanguage } from '@/lib/problemLanguage'
import { mockTeacherSubmissionReviews } from '@/mocks/fixtures'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'

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
  const submissionReview = mockTeacherSubmissionReviews[submissionId]
  const { user, isLoading: isUserLoading } = useCurrentUser()
  const { workspace, isLoading: isWorkspaceLoading } = useWorkspace(spaceId)
  const problemId = submissionReview?.problemId ?? 0
  const { problem, isLoading: isProblemLoading } = useProblem(spaceId, problemId)

  const [lineComments, setLineComments] = useState<TeacherLineComment[]>(
    () => submissionReview?.lineComments.map((comment) => ({ ...comment })) ?? [],
  )
  const [overallFeedback, setOverallFeedback] = useState(
    () => submissionReview?.overallFeedback ?? '',
  )
  const [lineSelection, setLineSelection] = useState<TeacherLineSelection | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const editorLanguage = useMemo(
    () => (problem ? toEditorLanguage(problem.language) : 'PYTHON'),
    [problem],
  )

  const isLoading = isUserLoading || isWorkspaceLoading || isProblemLoading

  const handleLineNumberClick = useCallback((lineNumber: number, shiftKey: boolean) => {
    setLineSelection((previous) => buildTeacherLineSelection(previous, lineNumber, shiftKey))
  }, [])

  const handleAddLineComment = useCallback(
    (startLine: number, endLine: number, message: string) => {
      setLineComments((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          startLine,
          endLine,
          message,
        },
      ])
      setLineSelection(null)
    },
    [],
  )

  const handleRemoveLineComment = useCallback((id: string) => {
    setLineComments((prev) => prev.filter((comment) => comment.id !== id))
  }, [])

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    try {
      // API 연동 전까지 로컬 상태만 유지
      await Promise.resolve()
      navigate(`/teacher/spaces/${spaceId}`)
    } finally {
      setIsSaving(false)
    }
  }, [navigate, spaceId])

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

  if (!submissionReview) {
    return (
      <main className="bg-background text-light-background flex flex-1 items-center justify-center px-4">
        <p className="text-body1 text-gray-400">
          {TEACHER_SUBMISSION_REVIEW_COPY.invalidParams}
        </p>
      </main>
    )
  }

  if (!isLoading && (!workspace || !problem)) {
    return (
      <main className="bg-background text-light-background flex flex-1 items-center justify-center px-4">
        <p className="text-body1 text-gray-400">
          {TEACHER_SUBMISSION_REVIEW_COPY.invalidParams}
        </p>
      </main>
    )
  }

  if (isLoading || !workspace || !problem) {
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
        studentNickname={submissionReview.studentNickname}
        onBack={() => navigate(`/teacher/spaces/${spaceId}`)}
        onSave={handleSave}
        isSaving={isSaving}
      />

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
              code={submissionReview.code}
              language={editorLanguage}
              submittedAt={submissionReview.submittedAt}
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
              onChange={setOverallFeedback}
            />
          </section>
        </div>
      </main>
    </div>
  )
}

export default SubmissionReviewPage
