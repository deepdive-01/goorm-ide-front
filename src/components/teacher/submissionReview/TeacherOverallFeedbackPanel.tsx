import Card from '@/components/common/Card/Card'
import { TEACHER_SUBMISSION_REVIEW_COPY } from '@/content/teacherSubmissionReview'

type TeacherOverallFeedbackPanelProps = {
  value: string
  onChange: (value: string) => void
}

function TeacherOverallFeedbackPanel({ value, onChange }: TeacherOverallFeedbackPanelProps) {
  const copy = TEACHER_SUBMISSION_REVIEW_COPY

  return (
    <Card width="w-full" className="bg-[#0d0d0d] border-gray-800 flex flex-col gap-5 px-7 py-6">
      <header className="flex flex-col gap-1.5">
        <h2 className="text-body1 text-white font-semibold">{copy.overallFeedbackTitle}</h2>
        <p className="text-body2 text-gray-400">{copy.overallFeedbackDescription}</p>
      </header>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={copy.overallFeedbackPlaceholder}
        rows={4}
        className="text-body1 text-light-background placeholder:text-gray-400 border-gray-800 bg-[#0e0e0e] min-h-[80px] w-full resize-y rounded-lg border px-3 py-3 focus:border-neon-green focus:outline-none"
      />
    </Card>
  )
}

export default TeacherOverallFeedbackPanel
