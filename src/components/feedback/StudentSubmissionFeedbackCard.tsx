import type { StudentSubmissionFeedbackCardProps } from '@/types/codeFeedback.type'

function StudentSubmissionFeedbackCard({ feedback }: StudentSubmissionFeedbackCardProps) {
  return (
    <article className="flex w-full flex-col gap-3 rounded-xl bg-gray-900 px-7 py-6">
      <header className="flex flex-wrap items-center gap-3">
        <span className="text-body1 font-semibold text-light-background">
          {feedback.authorName}
        </span>
        <time className="text-body2 text-gray-400" dateTime={feedback.createdAt}>
          {feedback.createdAt}
        </time>
      </header>
      <p className="text-body2 font-normal leading-relaxed text-light-background">
        {feedback.message}
      </p>
    </article>
  )
}

export default StudentSubmissionFeedbackCard
