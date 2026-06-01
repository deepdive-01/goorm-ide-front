import { useReducer, useEffect, useRef } from 'react'
import CodeEditor from './CodeEditor'
import ResultPanel from './ResultPanel'
import EditorToolbar from './EditorToolbar'
import type { EditorProps, TabId, RunHistoryItem } from '@/types/editor.type'

// stdin, activeTab, runHistory 세 상태를 하나의 reducer로 묶어 관리합니다.
// useEffect 내에서 여러 setState를 동기 호출하면 React Compiler 룰에 위반되므로,
// dispatch 한 번으로 관련 상태를 원자적으로 갱신합니다.
interface EditorState {
  stdin: string
  activeTab: TabId
  runHistory: RunHistoryItem[]
}

type EditorAction =
  | { type: 'SET_STDIN'; payload: string }
  | { type: 'SET_TAB'; payload: TabId }
  | { type: 'ADD_RUN_RESULT'; payload: RunHistoryItem }

function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_STDIN':
      return { ...state, stdin: action.payload }
    case 'SET_TAB':
      return { ...state, activeTab: action.payload }
    case 'ADD_RUN_RESULT':
      return {
        ...state,
        runHistory: [...state.runHistory, action.payload],
        // stderr가 있으면 에러 탭으로 자동 전환, 아니면 현재 탭 유지
        activeTab: action.payload.stderr ? '에러' : state.activeTab,
      }
  }
}

function Editor({
  language,
  value,
  onChange,
  onLanguageChange,
  onRun,
  onSave,
  onSubmit,
  isRunning = false,
  isSaving = false,
  isSubmitting = false,
  disabled = false,
  executionResult,
  gradeResult,
  height = '300px',
  readOnly = false,
  className = '',
}: EditorProps) {
  const [state, dispatch] = useReducer(editorReducer, {
    stdin: '',
    activeTab: '실행결과',
    runHistory: [],
  })

  // 실행 버튼을 누른 시점의 stdin을 캡처합니다.
  // executionResult는 WebSocket을 통해 비동기로 수신되므로,
  // 결과가 도착할 때 state.stdin은 이미 변경됐을 수 있어 ref로 고정합니다.
  const pendingStdinRef = useRef('')

  useEffect(() => {
    if (!executionResult) return
    dispatch({
      type: 'ADD_RUN_RESULT',
      payload: {
        stdin: pendingStdinRef.current,
        output: executionResult.output,
        stderr: executionResult.stderr,
        status: executionResult.status,
      },
    })
  }, [executionResult])

  const handleRun = () => {
    dispatch({ type: 'SET_TAB', payload: '실행결과' })
    pendingStdinRef.current = state.stdin
    onRun?.(state.stdin)
  }

  return (
    <div
      className={`bg-background min-w-150 rounded-xl border border-gray-800 ${className}`}
    >
      <EditorToolbar
        language={language}
        onLanguageChange={onLanguageChange}
        onRun={handleRun}
        onSave={onSave}
        onSubmit={onSubmit}
        isRunning={isRunning}
        isSaving={isSaving}
        isSubmitting={isSubmitting}
        disabled={disabled}
      />
      <CodeEditor
        value={value}
        language={language}
        height={height}
        onChange={onChange}
        readOnly={readOnly}
      />
      <ResultPanel
        executionResult={executionResult}
        gradeResult={gradeResult}
        runHistory={state.runHistory}
        stdin={state.stdin}
        onStdinChange={(v) => dispatch({ type: 'SET_STDIN', payload: v })}
        activeTab={state.activeTab}
        onTabChange={(tab) => dispatch({ type: 'SET_TAB', payload: tab })}
      />
    </div>
  )
}

export default Editor
