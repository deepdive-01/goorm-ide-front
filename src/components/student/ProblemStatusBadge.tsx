import { Check, Clock } from 'lucide-react'
import { STUDENT_PROBLEMS_COPY } from '@/content/studentProblems'
import type { ProblemSubmissionStatus } from '@/types/studentProblem.type'

const STATUS_CONFIG: Record<
  ProblemSubmissionStatus,
  { label: string; className: string; icon?: 'check' | 'clock' }
> = {
  COMPLETED: {
    label: STUDENT_PROBLEMS_COPY.statusCompleted,
    className: 'text-neon-green border-neon-green/40 bg-neon-green/10',
    icon: 'check',
  },
  SUBMITTED: {
    label: STUDENT_PROBLEMS_COPY.statusSubmitted,
    className: 'text-gray-300 border-gray-800 bg-gray-900',
    icon: 'clock',
  },
  NOT_SUBMITTED: {
    label: STUDENT_PROBLEMS_COPY.statusNotSubmitted,
    className: 'text-gray-400 border-gray-800 bg-gray-900',
  },
}

type ProblemStatusBadgeProps = {
  status: ProblemSubmissionStatus
}

function ProblemStatusBadge({ status }: ProblemStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={`text-body3 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium ${config.className}`}
    >
      {config.icon === 'check' && (
        <Check className="size-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
      )}
      {config.icon === 'clock' && (
        <Clock className="size-3.5 shrink-0" aria-hidden />
      )}
      {config.label}
    </span>
  )
}

export default ProblemStatusBadge
