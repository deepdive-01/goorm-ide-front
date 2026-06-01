import type { Language } from '@/types/api.type'

export type { Language }

export type TabId = '실행결과' | '테스트케이스' | '에러'

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface ExecutionResult {
  status: 'SUCCESS' | 'ERROR'
  output: string
  stderr: string
  exit_code?: number
  execution_time?: number
}

export interface GradeResultItem {
  order_num: number
  passed: boolean
  input: string
  expected_output: string
  actual_output: string
}

export interface GradeResult {
  status: 'PASS' | 'FAIL'
  pass_count: number
  total_count: number
  results: GradeResultItem[]
}

export interface EditorProps {
  language: Language
  value: string
  onChange: (value: string) => void
  onLanguageChange: (language: Language) => void

  onRun?: (stdin: string) => void
  onSave?: () => void
  onSubmit?: () => void
  onCancelSubmit?: () => void
  canCancelSubmit?: boolean
  cancelSubmitLabel?: string
  isRunning?: boolean
  isSaving?: boolean
  isSubmitting?: boolean
  isCancelling?: boolean
  disabled?: boolean

  executionResult?: ExecutionResult | null
  gradeResult?: GradeResult | null
  testCases?: TestCase[]

  height?: string
  readOnly?: boolean
  className?: string
}

export interface CodeEditorProps {
  value: string
  language: Language
  height?: string
  onChange: (value: string) => void
  readOnly?: boolean
}

export interface EditorToolbarProps {
  language: Language
  onLanguageChange: (language: Language) => void
  onRun?: () => void
  onSave?: () => void
  onSubmit?: () => void
  onCancelSubmit?: () => void
  canCancelSubmit?: boolean
  cancelSubmitLabel?: string
  isRunning?: boolean
  isSaving?: boolean
  isSubmitting?: boolean
  isCancelling?: boolean
  disabled?: boolean
}

export interface RunHistoryItem {
  stdin: string
  output: string
  stderr: string
  status: 'SUCCESS' | 'ERROR'
}

export interface ResultPanelProps {
  executionResult?: ExecutionResult | null
  gradeResult?: GradeResult | null
  runHistory?: RunHistoryItem[]
  stdin: string
  onStdinChange: (value: string) => void
  activeTab: TabId
  onTabChange: (tab: TabId) => void
}
