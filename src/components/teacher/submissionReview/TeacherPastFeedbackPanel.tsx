import Card from '@/components/common/Card/Card'
import { StudentSubmissionFeedbackList } from '@/components/feedback'
import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'
import type { StudentSubmissionFeedbackItem } from '@/types/codeFeedback.type'

type TeacherPastFeedbackPanelProps = {
  items: StudentSubmissionFeedbackItem[]
}

function TeacherPastFeedbackPanel({ items }: TeacherPastFeedbackPanelProps) {
  if (items.length === 0) {
    return null
  }

  const copy = TEACHER_SUBMISSION_REVIEW_COPY

  return (
    <Card width="w-full" className="bg-[#0d0d0d] border-gray-800 flex flex-col gap-5 px-7 py-6">
      <header className="flex flex-col gap-1.5">
        <h2 className="text-body1 text-white font-semibold">{copy.pastFeedbackTitle}</h2>
        <p className="text-body2 text-gray-400">{copy.pastFeedbackDescription}</p>
      </header>

      <StudentSubmissionFeedbackList items={items} />
    </Card>
  )
}

export default TeacherPastFeedbackPanel
