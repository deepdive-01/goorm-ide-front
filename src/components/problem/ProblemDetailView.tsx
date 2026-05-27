import { Info } from 'lucide-react'
import ProblemDescriptionBody from '@/components/problem/ProblemDescriptionBody'
import ProblemDetailHeader from '@/components/problem/ProblemDetailHeader'
import ProblemExampleBlock from '@/components/problem/ProblemExampleBlock'
import {
  PROBLEM_DETAIL_COPY,
  PROBLEM_DETAIL_EXTRAS_BY_ID,
  type ProblemDetailExtras,
} from '@/content/problemDetail'
import type { ProblemDetail } from '@/types/problem.type'

type ProblemDetailViewProps = {
  problem: ProblemDetail
  extras?: ProblemDetailExtras
}

function getVisibleTestcases(problem: ProblemDetail) {
  return [...problem.testcases]
    .filter((testcase) => !testcase.is_hidden)
    .sort((a, b) => a.order_num - b.order_num)
}

function ProblemDetailView({ problem, extras }: ProblemDetailViewProps) {
  const copy = PROBLEM_DETAIL_COPY
  const display = extras ?? PROBLEM_DETAIL_EXTRAS_BY_ID[problem.id]
  const visibleExamples = getVisibleTestcases(problem)
  const hasInputFormat =
    display?.inputFormatLines && display.inputFormatLines.length > 0
  const hasOutputFormat =
    display?.outputFormatLines && display.outputFormatLines.length > 0
  const hasConstraints =
    display?.constraints && display.constraints.length > 0

  return (
    <div className="flex flex-col gap-10">
      <ProblemDetailHeader problem={problem} />

      <section className="flex flex-col gap-3">
        <h3 className="text-body1 text-neon-green font-semibold">
          {copy.description}
        </h3>
        <ProblemDescriptionBody description={problem.description} />
      </section>

      {(hasInputFormat || hasOutputFormat) && (
        <section
          className={`grid gap-8 ${hasInputFormat && hasOutputFormat ? 'sm:grid-cols-2' : ''}`}
        >
          {hasInputFormat && (
            <div className="flex flex-col gap-3">
              <h3 className="text-body1 text-neon-blue font-semibold">
                {copy.inputFormat}
              </h3>
              <ul className="text-body2 text-gray-400 flex list-disc flex-col gap-2 pl-5">
                {display!.inputFormatLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
          {hasOutputFormat && (
            <div className="flex flex-col gap-3">
              <h3 className="text-body1 text-neon-blue font-semibold">
                {copy.outputFormat}
              </h3>
              <ul className="text-body2 text-gray-400 flex list-disc flex-col gap-2 pl-5">
                {display!.outputFormatLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {visibleExamples.length > 0 && (
        <section className="flex flex-col gap-6">
          <h3 className="text-body1 text-neon-green font-semibold">
            {copy.examples}
          </h3>
          {visibleExamples.map((testcase, index) => (
            <ProblemExampleBlock
              key={testcase.id ?? `${testcase.order_num}-${index}`}
              index={index + 1}
              testcase={testcase}
              explanation={display?.exampleExplanations?.[index]}
            />
          ))}
        </section>
      )}

      {hasConstraints && (
        <section className="border-gray-800 flex flex-col gap-4 border-t pt-8">
          <div className="flex items-center gap-2">
            <Info className="text-gray-500 size-4 shrink-0" aria-hidden />
            <h3 className="text-body3 text-gray-500 font-medium tracking-wider uppercase">
              {copy.constraints}
            </h3>
          </div>
          <ul className="flex flex-wrap gap-2">
            {display!.constraints!.map((constraint) => (
              <li
                key={constraint}
                className="text-body3 text-gray-300 border-gray-800 bg-gray-900 rounded-lg border px-3 py-2 font-mono"
              >
                {constraint}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default ProblemDetailView
