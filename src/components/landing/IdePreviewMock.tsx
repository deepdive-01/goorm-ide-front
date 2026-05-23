import type { ReactNode } from 'react'
import { MessageSquare } from 'lucide-react'
import { LANDING_COPY } from '@/content/landing'

const preview = LANDING_COPY.showcase.preview

const SYNTAX = {
  keyword: 'text-[#c792ea]',
  fn: 'text-[#82aaff]',
  param: 'text-[#ffcb6b]',
  comment: 'text-gray-600',
  string: 'text-[#c3e88d]',
  plain: 'text-gray-300',
} as const

function CodeLine({
  num,
  children,
  isError,
}: {
  num: number
  children: ReactNode
  isError?: boolean
}) {
  return (
    <div className={`relative flex gap-3 pr-6 ${isError ? 'bg-[#3d1f1f]/60' : ''}`}>
      <span className="text-gray-600 w-5 shrink-0 select-none text-right text-xs">
        {num}
      </span>
      <code className="text-body3 flex-1 font-mono leading-6">{children}</code>
      {isError && (
        <span
          className="absolute top-1/2 right-1 size-0 -translate-y-1/2 border-y-[5px] border-l-[6px] border-y-transparent border-l-[#f87171]"
          aria-hidden
        />
      )}
    </div>
  )
}

function IdePreviewMock() {
  const isErrorLine = (n: number) => n === preview.errorLineNumber

  return (
    <div
      className="border-gray-800 bg-gray-900 flex min-h-[280px] w-full flex-col overflow-hidden rounded-lg border"
      aria-hidden
    >
      <div className="border-gray-800 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57]" aria-hidden />
        <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e]" aria-hidden />
        <span className="size-2.5 shrink-0 rounded-full bg-[#28c840]" aria-hidden />
        <span className="text-body3 text-gray-500 flex-1 text-center">
          {preview.filename}
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <pre className="bg-background flex-1 overflow-x-auto p-3 sm:border-gray-800 sm:border-r">
          <CodeLine num={1} isError={isErrorLine(1)}>
            <span className={SYNTAX.keyword}>import </span>
            <span className={SYNTAX.plain}>math</span>
          </CodeLine>
          <CodeLine num={2} isError={isErrorLine(2)}>
            <span className={SYNTAX.plain}> </span>
          </CodeLine>
          <CodeLine num={3} isError={isErrorLine(3)}>
            <span className={SYNTAX.keyword}>def </span>
            <span className={SYNTAX.fn}>solution</span>
            <span className={SYNTAX.plain}>():</span>
          </CodeLine>
          <CodeLine num={4} isError={isErrorLine(4)}>
            <span className={SYNTAX.plain}>    </span>
            <span className={SYNTAX.param}>arr</span>
            <span className={SYNTAX.plain}> = [2, 5, 1, 3]</span>
          </CodeLine>
          <CodeLine num={5} isError={isErrorLine(5)}>
            <span className={SYNTAX.comment}>    # Problem: Sorting...</span>
          </CodeLine>
          <CodeLine num={6} isError>
            <span className={SYNTAX.plain}>    </span>
            <span className={SYNTAX.keyword}>return </span>
            <span className="text-[#f87171] decoration-[#f87171] underline decoration-wavy decoration-2 underline-offset-4">
              arr.sort()
            </span>
          </CodeLine>
          <CodeLine num={7} isError={isErrorLine(7)}>
            <span className={SYNTAX.comment}>    # return sorted(arr)</span>
          </CodeLine>
          <CodeLine num={8} isError={isErrorLine(8)}>
            <span className={SYNTAX.plain}> </span>
          </CodeLine>
          <CodeLine num={9} isError={isErrorLine(9)}>
            <span className={SYNTAX.keyword}>if </span>
            <span className={SYNTAX.plain}>__name__ == </span>
            <span className={SYNTAX.string}>&quot;__main__&quot;</span>
            <span className={SYNTAX.plain}>:</span>
          </CodeLine>
          <CodeLine num={10} isError={isErrorLine(10)}>
            <span className={SYNTAX.plain}>    </span>
            <span className={SYNTAX.fn}>solution</span>
            <span className={SYNTAX.plain}>()</span>
          </CodeLine>
        </pre>

        <div className="border-gray-800 flex w-full shrink-0 flex-col gap-3 border-t p-4 sm:w-[220px] sm:border-t-0">
          <div className="text-neon-blue flex items-center gap-2">
            <MessageSquare className="size-4 shrink-0" aria-hidden />
            <span className="text-body3 font-semibold">{preview.feedbackTitle}</span>
          </div>
          <div className="border-neon-blue/40 bg-gray-900/80 border-l-neon-blue flex flex-col gap-2 rounded border border-l-4 p-3">
            <p className="text-body3 text-gray-300 leading-relaxed">
              <span className="text-neon-blue font-semibold">
                {preview.feedbackLineRef}
              </span>{' '}
              return 값이 없습니다.{' '}
              <span className="bg-neon-green text-black rounded px-1 font-mono">
                {preview.feedbackCode}
              </span>
              를 사용하거나 정렬 후 배열을 반환해주세요.
            </p>
            <span className="text-body3 text-gray-600 self-end">
              {preview.feedbackTime}
            </span>
          </div>
        </div>
      </div>

      <div className="border-gray-800 text-body3 flex flex-wrap items-center justify-between gap-2 border-t px-4 py-2.5">
        <div className="flex gap-2">
          <span className="border-neon-green/50 text-neon-green rounded border px-2.5 py-0.5">
            {preview.submitLabel}
          </span>
          <span className="border-gray-700 text-gray-500 rounded border px-2.5 py-0.5">
            {preview.reviewLabel}
          </span>
        </div>
        <div className="text-gray-500 flex items-center gap-1.5">
          <span className="bg-neon-blue size-2 shrink-0 rounded-full" aria-hidden />
          {preview.runtimeLabel}
        </div>
      </div>
    </div>
  )
}

export default IdePreviewMock
