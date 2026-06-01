import { CODE_FEEDBACK_COPY } from '@/content/codeFeedback'
import type { StudentCodeCommentsListProps } from '@/types/codeFeedback.type'
import StudentCodeCommentCard from './StudentCodeCommentCard'

function StudentCodeCommentsList({
  items,
  code,
  language,
  emptyMessage = CODE_FEEDBACK_COPY.emptyCodeComments,
}: StudentCodeCommentsListProps) {
  if (items.length === 0) {
    return <p className="text-body2 py-12 text-center text-gray-500">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((comment) => (
        <li key={comment.id}>
          <StudentCodeCommentCard comment={comment} code={code} language={language} />
        </li>
      ))}
    </ul>
  )
}

export default StudentCodeCommentsList
