import { DIFFICULTY_CLASS } from '@/constants/problem'
import type { ProblemDetail } from '@/types/problem.type'

type ProblemDetailHeaderProps = {
  problem: ProblemDetail
}

function ProblemDetailHeader({ problem }: ProblemDetailHeaderProps) {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`text-body3 border px-2 py-0.5 font-semibold tracking-wide uppercase ${DIFFICULTY_CLASS[problem.difficulty]}`}
        >
          {problem.difficulty}
        </span>
        <span className="text-body3 text-gray-500 tabular-nums">
          ID #{problem.id}
        </span>
      </div>
      <h2 className="text-head2 text-white leading-tight">{problem.title}</h2>
    </header>
  )
}

export default ProblemDetailHeader
