import Card from '@/components/common/Card/Card'
import { STUDENT_PROBLEM_WORKSPACE_COPY } from '@/content/studentProblemWorkspace'
import type { ProblemDetail } from '@/types/problem.type'

interface ProblemDescriptionTabProps {
  problem: ProblemDetail
}

function ProblemDescriptionTab({ problem }: ProblemDescriptionTabProps) {
  const example = problem.testcases[0]
  const copy = STUDENT_PROBLEM_WORKSPACE_COPY.description

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col gap-4">
        <h2 className="text-head3 text-white">{copy.title}</h2>
        <p className="text-body2 text-gray-400 leading-relaxed whitespace-pre-line">
          {problem.description}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-head3 text-white">{copy.inputFormat}</h2>
        <ul className="text-body2 text-gray-400 list-disc pl-5">
          <li>{copy.inputConstraint}</li>
        </ul>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-head3 text-white">{copy.outputFormat}</h2>
        <ul className="text-body2 text-gray-400 list-disc pl-5">
          <li>{copy.outputConstraint}</li>
        </ul>
      </section>

      {example && (
        <section className="flex flex-col gap-4">
          <h2 className="text-head3 text-white">{copy.example}</h2>
          <Card
            width="w-full"
            className="bg-black border-gray-800 flex flex-col gap-4 py-5"
          >
            <div className="flex flex-col gap-2">
              <span className="text-body3 text-gray-500">{copy.inputLabel}</span>
              <div className="bg-gray-900 rounded-lg px-4 py-3">
                <span className="text-body2 text-neon-green font-mono font-medium">
                  {example.input}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-body3 text-gray-500">{copy.outputLabel}</span>
              <div className="bg-gray-900 rounded-lg px-4 py-3">
                <span className="text-body2 text-neon-blue font-mono font-medium">
                  {example.expected_output}
                </span>
              </div>
            </div>
          </Card>
        </section>
      )}
    </div>
  )
}

export default ProblemDescriptionTab
