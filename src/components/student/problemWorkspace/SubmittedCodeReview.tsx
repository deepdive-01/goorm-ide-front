import { ChevronDown, ChevronUp, GraduationCap, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import Card from '@/components/common/Card/Card'
import { STUDENT_PROBLEM_WORKSPACE_COPY } from '@/content/studentProblemWorkspace'
import type { SubmittedCodeReviewComment } from '@/types/studentProblemWorkspace.type'

interface SubmittedCodeReviewProps {
  comments: SubmittedCodeReviewComment[]
}

function SubmittedCodeReview({ comments }: SubmittedCodeReviewProps) {
  const [isOpen, setIsOpen] = useState(true)
  const copy = STUDENT_PROBLEM_WORKSPACE_COPY.review

  if (comments.length === 0) {
    return null
  }

  return (
    <Card
      width="w-full"
      className="bg-black border-gray-800 flex flex-col gap-0 p-0 overflow-hidden"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="text-neon-green size-5 shrink-0" aria-hidden />
          <span className="text-head3 text-white">{copy.title}</span>
          <span className="text-body3 text-gray-400 border-gray-800 rounded border px-2 py-0.5">
            {copy.commentCount(comments.length)}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="text-gray-400 size-5 shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="text-gray-400 size-5 shrink-0" aria-hidden />
        )}
      </button>

      {isOpen && (
        <div className="border-gray-800 flex flex-col gap-4 border-t px-5 py-5">
          {comments.map((comment) => (
            <div key={comment.lineNumber} className="flex flex-col gap-3">
              <div className="border-neon-green/50 bg-gray-900/40 flex items-start gap-3 rounded-lg border-l-4 px-4 py-3 font-mono">
                <span className="text-body3 text-gray-500 shrink-0">
                  {comment.lineNumber}
                </span>
                <code className="text-body2 text-gray-200 flex-1">{comment.code}</code>
              </div>
              <Card
                width="w-full"
                className="bg-gray-900/60 border-gray-800 flex gap-3 py-4"
              >
                <GraduationCap
                  className="text-neon-green mt-0.5 size-5 shrink-0"
                  aria-hidden
                />
                <div className="flex flex-col gap-1">
                  <span className="text-body2 text-neon-green font-medium">
                    {comment.authorName}{' '}
                    <span className="text-gray-500 font-normal">
                      {copy.lineLabel(comment.lineNumber)}
                    </span>
                  </span>
                  <p className="text-body2 text-gray-300 leading-relaxed">
                    {comment.message}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

export default SubmittedCodeReview
