import Card from '@/components/common/Card/Card'
import CodeFeedbackEditor from '@/components/feedback/CodeFeedbackEditor'
import {
  TEACHER_REVIEW_STUDENT_CODE_SCROLL_MAX_CLASS,
  TEACHER_SUBMISSION_REVIEW_COPY,
} from '@/content/teacherSubmissionReview'
import {
  formatSubmissionDateTime,
  toEditorLineComments,
  type TeacherLineSelection,
} from '@/lib/teacherLineComment'
import type { Language } from '@/types/editor.type'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'
import TeacherLineCommentForm from './TeacherLineCommentForm'

type TeacherStudentCodeSectionProps = {
  code: string
  language: Language
  submittedAt: string
  lineComments: TeacherLineComment[]
  lineSelection: TeacherLineSelection | null
  onLineNumberClick: (lineNumber: number, shiftKey: boolean) => void
  onAddLineComment: (startLine: number, endLine: number, message: string) => void
  onDismissLineCommentForm: () => void
}

function TeacherStudentCodeSection({
  code,
  language,
  submittedAt,
  lineComments,
  lineSelection,
  onLineNumberClick,
  onAddLineComment,
  onDismissLineCommentForm,
}: TeacherStudentCodeSectionProps) {
  const copy = TEACHER_SUBMISSION_REVIEW_COPY
  const editorComments = toEditorLineComments(lineComments)

  return (
    <Card
      width="w-full"
      className={`bg-[#0d0d0d] border-gray-800 flex min-h-0 min-w-0 flex-col overflow-hidden !px-0 !py-0 ${TEACHER_REVIEW_STUDENT_CODE_SCROLL_MAX_CLASS}`}
    >
      <header className="shrink-0 px-7 pt-6 pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-body1 text-white font-semibold">{copy.studentCode}</h2>
          {submittedAt && (
            <p className="text-body2 text-gray-400">
              {copy.submittedAt(formatSubmissionDateTime(submittedAt))}
            </p>
          )}
        </div>
        <p className="text-body3 text-gray-500 mt-3">{copy.lineClickHint}</p>
      </header>

      <div className="scrollbar-theme flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-7 pb-6">
        <CodeFeedbackEditor
          code={code}
          language={language}
          comments={editorComments}
          height="220px"
          readOnly
          className="w-full max-w-full shrink-0"
          selectedLineRange={
            lineSelection
              ? { startLine: lineSelection.startLine, endLine: lineSelection.endLine }
              : null
          }
          onLineNumberClick={onLineNumberClick}
        />

        {lineSelection && (
          <TeacherLineCommentForm
            startLine={lineSelection.startLine}
            endLine={lineSelection.endLine}
            onAdd={(message) =>
              onAddLineComment(lineSelection.startLine, lineSelection.endLine, message)
            }
            onCancel={onDismissLineCommentForm}
          />
        )}
      </div>
    </Card>
  )
}

export default TeacherStudentCodeSection
