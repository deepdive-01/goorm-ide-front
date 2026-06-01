import { StudentSubmissionFeedbackList } from '@/components/feedback'
import type { StudentSubmissionFeedbackItem } from '@/types/codeFeedback.type'

interface ProblemFeedbackTabProps {
  items: StudentSubmissionFeedbackItem[]
}

function ProblemFeedbackTab({ items }: ProblemFeedbackTabProps) {
  return <StudentSubmissionFeedbackList items={items} />
}

export default ProblemFeedbackTab
