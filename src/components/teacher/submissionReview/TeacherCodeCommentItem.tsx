import { X } from 'lucide-react'
import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'
import { formatTeacherLineLabel } from '@/lib/teacherLineComment'
import type { TeacherLineComment } from '@/types/teacherSubmissionReview.type'

type TeacherCodeCommentItemProps = {
  comment: TeacherLineComment
  onRemove: (id: string) => void
}

function TeacherCodeCommentItem({ comment, onRemove }: TeacherCodeCommentItemProps) {
  const copy = TEACHER_SUBMISSION_REVIEW_COPY

  return (
    <article className="bg-[#151515] box-border flex w-full max-w-full items-start gap-3 rounded-xl px-5 py-5">
      <div className="min-w-0 flex-1">
        <p className="text-body3 text-neon-blue font-bold">
          {formatTeacherLineLabel(comment.startLine, comment.endLine)}
        </p>
        <p className="text-body3 text-light-background mt-2 font-bold break-words leading-relaxed whitespace-pre-wrap">
          {comment.message}
        </p>
      </div>
      <button
        type="button"
        className="text-gray-500 hover:text-light-background shrink-0 transition-colors"
        aria-label={copy.removeComment}
        onClick={() => onRemove(comment.id)}
      >
        <X className="size-4" aria-hidden />
      </button>
    </article>
  )
}

export default TeacherCodeCommentItem
