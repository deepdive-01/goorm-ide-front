import { useState, type FormEvent } from 'react'
import Button from '@/components/common/Button/Button'
import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'

type TeacherLineCommentFormProps = {
  startLine: number
  endLine: number
  onAdd: (message: string) => void
  onCancel?: () => void
}

function TeacherLineCommentForm({
  startLine,
  endLine,
  onAdd,
  onCancel,
}: TeacherLineCommentFormProps) {
  const copy = TEACHER_SUBMISSION_REVIEW_COPY
  const [draft, setDraft] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = draft.trim()
    if (!trimmed) return

    onAdd(trimmed)
    setDraft('')
  }

  return (
    <div className="border-neon-blue bg-[#0d0d0d] box-border flex w-full max-w-full shrink-0 flex-col gap-5 rounded-xl border px-7 py-6">
      <p className="text-body2 text-neon-blue font-medium">
        {copy.addCommentToLine(startLine, endLine)}
      </p>

      <form onSubmit={handleSubmit} className="flex w-full max-w-full flex-col gap-3">
        <div className="bg-[#151515] flex w-full max-w-full items-end gap-3 rounded-lg px-3 py-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={copy.commentPlaceholder}
            rows={1}
            className="text-body1 text-light-background placeholder:text-gray-400 min-h-[40px] min-w-0 flex-1 resize-none bg-transparent py-2 focus:outline-none"
          />
          <Button
            type="submit"
            size="sm"
            bgColor="bg-[#060606]"
            textColor="text-light-background"
            textClassName="text-body3 font-bold"
            className="border-gray-800 mb-1 shrink-0 border px-3 py-2"
            disabled={!draft.trim()}
          >
            {copy.addComment}
          </Button>
        </div>
        {onCancel && (
          <button
            type="button"
            className="text-body3 text-gray-500 self-start hover:text-gray-300"
            onClick={onCancel}
          >
            {copy.cancelLineComment}
          </button>
        )}
      </form>
    </div>
  )
}

export default TeacherLineCommentForm
