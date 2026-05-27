export type Language = 'python' | 'java' | 'javascript' | 'cpp'
export type TabId = '실행결과' | '테스트케이스' | '에러'

export interface TestCase {
  input: string
  expectedOutput: string
}

export interface ExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  executionTime: number
}

export interface EditorProps {
  roomId: number
  height?: string
  width?: string
  testCases?: TestCase[]
}

export interface CodeEditorProps {
  code: string
  language: Language
  height?: string
  onChange: (code: string) => void
}

export interface EditorToolbarProps {
  language: Language
  onLanguageChange: (lang: Language) => void
  onRun: () => void
}

export interface ResultPanelProps {
  executionResult?: ExecutionResult | null
  testCases?: TestCase[]
}
