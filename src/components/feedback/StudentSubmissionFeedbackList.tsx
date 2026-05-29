import { CODE_FEEDBACK_COPY } from '@/content/codeFeedback'
import type { StudentSubmissionFeedbackListProps } from '@/types/codeFeedback.type'
import StudentSubmissionFeedbackCard from './StudentSubmissionFeedbackCard'

function StudentSubmissionFeedbackList({
  items,
  emptyMessage = CODE_FEEDBACK_COPY.emptySubmissionFeedback,
}: StudentSubmissionFeedbackListProps) {
  if (items.length === 0) {
    return <p className="text-body2 py-12 text-center text-gray-500">{emptyMessage}</p>
  }

  return (
    <ul className="flex flex-col gap-2.5">
      {items.map((feedback) => (
        <li key={feedback.id}>
          <StudentSubmissionFeedbackCard feedback={feedback} />
        </li>
      ))}
    </ul>
  )
}

export default StudentSubmissionFeedbackList
