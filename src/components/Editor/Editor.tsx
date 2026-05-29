import { useEffect, useState } from 'react'
import CodeEditor from './CodeEditor'
import ResultPanel from './ResultPanel'
import EditorToolbar from './EditorToolbar'
import { executeCode } from '@/services/codeExecutionService'
import type { Language, ExecutionResult, EditorProps } from '@/types/editor.type'

function Editor({
  roomId,
  height = '100%',
  width = 'w-fit',
  testCases = [],
  initialCode = '',
  initialLanguage = 'python',
}: EditorProps) {
  const [code, setCode] = useState(initialCode)
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)

  useEffect(() => {
    setCode(initialCode)
  }, [initialCode])

  useEffect(() => {
    setLanguage(initialLanguage)
  }, [initialLanguage])

  const handleRun = async () => {
    const result = await executeCode({ roomId, language, code })
    setExecutionResult(result)
  }

  return (
    <div
      className={`bg-background ${width} min-w-150 rounded-xl border border-gray-800`}
    >
      <EditorToolbar
        language={language}
        onLanguageChange={setLanguage}
        onRun={handleRun}
      />
      <CodeEditor
        code={code}
        language={language}
        height={height}
        onChange={setCode}
      />
      <ResultPanel executionResult={executionResult} testCases={testCases} />
    </div>
  )
}

export default Editor
