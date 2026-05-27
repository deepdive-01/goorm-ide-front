import { useState } from 'react'
import CodeEditor from './CodeEditor'
import ResultPanel from './ResultPanel'
import EditorToolbar from './EditorToolbar'
import type { Language } from '@/types/editor.type'

interface EditorProps {
  roomId: number
  height?: string
  width?: string
}

function Editor({ roomId: _, height = '100%', width = 'w-fit' }: EditorProps) {
  const [code, setCode] = useState('')
  const [language] = useState<Language>('python')

  return (
    <div
      className={`bg-background ${width} min-w-150 rounded-xl border border-gray-800`}
    >
      <EditorToolbar />
      <CodeEditor
        code={code}
        language={language}
        height={height}
        onChange={setCode}
      />
      <ResultPanel />
    </div>
  )
}

export default Editor
