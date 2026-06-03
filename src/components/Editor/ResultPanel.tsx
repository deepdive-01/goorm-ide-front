import {
  Terminal,
  BookOpenCheck,
  SearchAlert,
  SquareTerminal,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TabId, ResultPanelProps } from '@/types/editor.type'

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: '실행결과', label: '실행 결과', icon: Terminal },
  { id: '테스트케이스', label: '테스트 케이스', icon: BookOpenCheck },
  { id: '에러', label: '에러', icon: SearchAlert },
]

function ResultPanel({
  executionResult = null,
  gradeResult = null,
  runHistory = [],
  stdin,
  onStdinChange,
  activeTab,
  onTabChange,
}: ResultPanelProps) {
  const stdoutLines =
    executionResult?.output?.split('\n').filter((line) => line !== '') ?? []

  return (
    <div>
      <div className="bg-background flex items-center border-y border-y-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`text-body3 flex items-center gap-2 px-6 py-2 whitespace-nowrap ${
              activeTab === id
                ? 'border-b-neon-blue border-b-2 text-white'
                : 'text-gray-400'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
        {gradeResult && (
          <span
            className={`text-body3 ml-2 font-semibold ${
              gradeResult.status === 'PASS' ? 'text-neon-blue' : 'text-red-400'
            }`}
          >
            {gradeResult.status}
          </span>
        )}
      </div>

      {activeTab === '실행결과' && (
        <div className="flex px-7 py-5">
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <SquareTerminal size={15} />
              <span className="text-body3 text-gray-600">STDIN</span>
            </div>
            <textarea
              value={stdin}
              onChange={(e) => onStdinChange(e.target.value)}
              className="text-body3 min-h-20 w-full resize-none bg-transparent text-gray-300 outline-none placeholder:text-gray-600"
              placeholder="입력값을 입력하세요"
            />
          </div>

          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <SquareTerminal size={15} />
              <span className="text-body3 text-gray-600">STDOUT</span>
            </div>
            <div className="text-body3 text-neon-blue flex flex-col gap-2">
              {stdoutLines.length > 0 ? (
                stdoutLines.map((line, i) => <div key={i}>{line}</div>)
              ) : (
                <span className="text-gray-600">__</span>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === '테스트케이스' && (
        <div className="flex flex-col gap-4 px-7 py-5">
          {gradeResult ? (
            <>
              <div className="text-body3 flex items-center gap-2">
                <span
                  className={
                    gradeResult.status === 'PASS'
                      ? 'text-neon-green font-semibold'
                      : 'font-semibold text-red-400'
                  }
                >
                  {gradeResult.status === 'PASS' ? '통과' : '실패'}
                </span>
                <span className="text-gray-500">
                  ({gradeResult.pass_count}/{gradeResult.total_count})
                </span>
              </div>
              {gradeResult.results.map((r) => (
                <div
                  key={r.order_num}
                  className="text-body3 flex flex-wrap items-center gap-2"
                >
                  <span className="text-neon-blue whitespace-nowrap">
                    TC {r.order_num}
                  </span>
                  <span className="text-gray-500">입력: {r.input}</span>
                  <span className="text-gray-600">→</span>
                  <span className="text-gray-500">
                    예상: {r.expected_output}
                  </span>
                  <span className="text-gray-600">→</span>
                  <span
                    className={r.passed ? 'text-neon-green' : 'text-red-400'}
                  >
                    실제: {r.actual_output}
                  </span>
                  <span
                    className={r.passed ? 'text-neon-green' : 'text-red-400'}
                  >
                    {r.passed ? '통과' : '실패'}
                  </span>
                </div>
              ))}
            </>
          ) : runHistory.length > 0 ? (
            runHistory.map((item, i) => (
              <div
                key={i}
                className="text-body3 flex flex-wrap items-center gap-2"
              >
                <span className="text-neon-blue whitespace-nowrap">
                  TC {i + 1}
                </span>
                <span className="text-gray-500">
                  입력: {item.stdin || '__'}
                </span>
                <span className="text-gray-600">→</span>
                <span
                  className={
                    item.status === 'SUCCESS'
                      ? 'text-neon-blue'
                      : 'text-red-400'
                  }
                >
                  {item.status === 'SUCCESS'
                    ? item.output?.trim() || '__'
                    : '오류'}
                </span>
              </div>
            ))
          ) : (
            <span className="text-body3 text-gray-600">
              실행 결과가 없습니다.
            </span>
          )}
        </div>
      )}

      {activeTab === '에러' && (
        <div className="flex flex-col gap-3 px-7 py-5">
          <div className="flex items-center gap-2 text-gray-600">
            <SearchAlert size={15} />
            <span className="text-body3 text-gray-600">에러</span>
          </div>
          {executionResult?.stderr ? (
            <pre className="text-body3 whitespace-pre-wrap text-red-400">
              {executionResult.stderr}
            </pre>
          ) : (
            <span className="text-body3 text-gray-600">__</span>
          )}
        </div>
      )}
    </div>
  )
}

export default ResultPanel
