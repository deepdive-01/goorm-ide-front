import Card from '@/components/common/Card/Card'
import ProblemStatusBadge from '@/components/student/ProblemStatusBadge'
import { STUDENT_PROBLEMS_COPY } from '@/content/studentProblems'
import type { StudentProblemListItem } from '@/types/studentProblem.type'

type ProblemListRowProps = {
  problem: StudentProblemListItem
  index: number
  onClick?: () => void
}

function ProblemListRow({ problem, index, onClick }: ProblemListRowProps) {
  const status = problem.submission_status ?? 'NOT_SUBMITTED'
  const testcaseCount = problem.testcase_count ?? 0

  return (
    <Card width="w-full" cursor={onClick ? 'pointer' : 'default'} onClick={onClick}>
      <div className="flex items-center gap-5">
        <div
          className="border-gray-800 bg-gray-900 text-body1 text-gray-400 flex size-12 shrink-0 items-center justify-center rounded-lg border font-medium tabular-nums"
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </div>

        <div className="min-w-0 flex-1 text-left">
          <h2 className="text-head3 text-white line-clamp-1">{problem.title}</h2>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-body3 text-gray-400 border-gray-800 rounded border px-2 py-0.5 font-medium uppercase">
              {problem.language}
            </span>
            {testcaseCount > 0 && (
              <span className="text-body3 text-gray-500">
                {STUDENT_PROBLEMS_COPY.testCaseCount(testcaseCount)}
              </span>
            )}
          </div>
        </div>

        <ProblemStatusBadge status={status} />
      </div>
    </Card>
  )
}

export default ProblemListRow
