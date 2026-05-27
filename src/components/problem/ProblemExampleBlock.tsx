import { PROBLEM_DETAIL_COPY } from '@/content/problemDetail'
import type { Testcase } from '@/types/problem.type'

type ProblemExampleBlockProps = {
  index: number
  testcase: Testcase
  explanation?: string
}

function ProblemExampleBlock({
  index,
  testcase,
  explanation,
}: ProblemExampleBlockProps) {
  const copy = PROBLEM_DETAIL_COPY

  return (
    <article className="flex flex-col gap-3">
      <h4 className="text-body3 text-gray-500 font-medium tracking-wider uppercase">
        {copy.example(index)}
      </h4>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-body3 text-gray-500">{copy.inputLabel}</span>
          <div className="bg-gray-900 border-gray-800 rounded-lg border px-4 py-3">
            <pre className="text-body2 text-neon-green font-mono font-medium whitespace-pre-wrap">
              {testcase.input}
            </pre>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-body3 text-gray-500">{copy.outputLabel}</span>
          <div className="bg-gray-900 border-gray-800 rounded-lg border px-4 py-3">
            <pre className="text-body2 text-neon-blue font-mono font-medium whitespace-pre-wrap">
              {testcase.expected_output}
            </pre>
          </div>
        </div>
      </div>
      {explanation && (
        <p className="text-body2 text-gray-500 leading-relaxed">{explanation}</p>
      )}
    </article>
  )
}

export default ProblemExampleBlock
