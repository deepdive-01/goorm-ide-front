import Card from '@/components/common/Card/Card'
import {
  TEACHER_REVIEW_PROBLEM_SCROLL_MAX_CLASS,
  TEACHER_SUBMISSION_REVIEW_COPY,
} from '@/content/teacherSubmissionReview'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'
import TeacherCodeCommentItem from './TeacherCodeCommentItem'

type TeacherCodeCommentsPanelProps = {
  comments: TeacherLineComment[]
  onRemove: (id: string) => void
}

function TeacherCodeCommentsPanel({ comments, onRemove }: TeacherCodeCommentsPanelProps) {
  const copy = TEACHER_SUBMISSION_REVIEW_COPY

  return (
    <Card
      width="w-full"
      className={`bg-[#0d0d0d] border-gray-800 flex min-h-0 min-w-0 flex-col overflow-hidden !px-0 !py-0 ${TEACHER_REVIEW_PROBLEM_SCROLL_MAX_CLASS}`}
    >
      <header className="shrink-0 px-7 pt-6 pb-4">
        <h2 className="text-body1 text-white font-semibold">{copy.codeCommentsTitle}</h2>
        <p className="text-body2 text-gray-400 mt-1.5">{copy.codeCommentsDescription}</p>
      </header>

      <div className="scrollbar-theme min-h-0 flex-1 overflow-y-auto px-7 pb-6">
        {comments.length === 0 ? (
          <p className="text-body2 text-gray-500 py-2">{copy.emptyCodeComments}</p>
        ) : (
          <ul className="flex w-full flex-col gap-3">
            {comments.map((comment) => (
              <li key={comment.id} className="w-full max-w-full">
                <TeacherCodeCommentItem comment={comment} onRemove={onRemove} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Card>
  )
}

export default TeacherCodeCommentsPanel
