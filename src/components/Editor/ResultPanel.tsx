import { useState } from 'react'
import {
  Terminal,
  BookOpenCheck,
  SearchAlert,
  SquareTerminal,
  Timer,
  SquareArrowRightEnter,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TabId, ResultPanelProps } from '@/types/editor.type'

const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: '실행결과', label: '실행 결과', icon: Terminal },
  { id: '테스트케이스', label: '테스트 케이스', icon: BookOpenCheck },
  { id: '에러', label: '에러', icon: SearchAlert },
]

function ResultPanel({ executionResult = null, testCases = [] }: ResultPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('실행결과')

  const stdoutLines =
    executionResult?.stdout.split('\n').filter((line) => line !== '') ?? []

  return (
    <div>
      {/* 상단 탭 */}
      <div className="bg-background flex items-start border-y border-y-gray-800">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
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
      </div>

      {/* 에러 탭 */}
      {activeTab === '에러' && (
        <div className="flex flex-col gap-3 px-7 py-5">
          <div className="flex items-center gap-2 text-gray-600">
            <SearchAlert size={15} />
            <div className="text-body3 text-gray-600">에러</div>
          </div>

          {executionResult?.stderr ? (
            <div className="text-body3 text-red-400">{executionResult.stderr}</div>
          ) : (
            <div className="text-body3 text-gray-600">__</div>
          )}
        </div>
      )}

      {/* 3열 콘텐츠 */}
      {activeTab !== '에러' && (
        <div className="flex px-7 py-5">
          {/* 실행결과 */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <SquareTerminal size={15} />
              <div className="text-body3 text-gray-600">STDOUT</div>
            </div>

            <div className="text-body3 text-neon-blue flex flex-col justify-start gap-2">
              {stdoutLines.length > 0 ? (
                stdoutLines.map((line, i) => <div key={i}>{line}</div>)
              ) : (
                <div className="text-gray-600">__</div>
              )}
            </div>
          </div>

          {/* 테스트케이스 */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpenCheck size={15} />
              <div className="text-body3 text-gray-600">테스트 케이스</div>
            </div>

            {testCases.length > 0 ? (
              testCases.map((tc, i) => (
                <div key={i} className="text-body3 flex justify-start gap-2">
                  <div className="text-neon-blue">TC {i + 1}</div>
                  <div className="text-gray-600">
                    입력: {tc.input} → 출력: {tc.expectedOutput}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-body3 text-gray-600">__</div>
            )}
          </div>

          {/* 실행 정보 */}
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-gray-600">
                <Timer size={15} />
                <div className="text-body3">실행 시간</div>
              </div>

              <div className="text-neon-blue text-body3 text-semibold">
                {executionResult ? `${executionResult.executionTime}S` : '__'}
              </div>
            </div>

            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-gray-600">
                <SquareArrowRightEnter size={15} />
                <div className="text-body3">종료 코드</div>
              </div>

              <div className="text-neon-blue text-body3 text-semibold">
                {executionResult ? executionResult.exitCode : '__'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultPanel
